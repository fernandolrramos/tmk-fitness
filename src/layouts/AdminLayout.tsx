import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Dumbbell,
  Inbox,
  LayoutGrid,
  LogOut,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useMessages } from '@/context/MessagesContext'
import { LanguageToggle } from '@/components/LanguageToggle'
import type { TranslationKey } from '@/i18n/translations'

const logo = '/brand/logo.png'

interface Item {
  to: string
  labelKey: TranslationKey
  icon: LucideIcon
  /** Show the staff unread badge on this item. */
  badge?: boolean
}

const items: Item[] = [
  { to: '/admin', labelKey: 'admin.nav.dashboard', icon: LayoutGrid },
  { to: '/admin/timetable', labelKey: 'admin.nav.timetable', icon: CalendarDays },
  { to: '/admin/bookings', labelKey: 'admin.nav.bookings', icon: ClipboardList },
  { to: '/admin/inbox', labelKey: 'admin.nav.inbox', icon: Inbox, badge: true },
  { to: '/admin/members', labelKey: 'admin.nav.members', icon: Users },
  { to: '/admin/trainers', labelKey: 'admin.nav.trainers', icon: Dumbbell },
  { to: '/admin/plans', labelKey: 'admin.nav.plans', icon: CreditCard },
]

export function AdminLayout() {
  const { t } = useLanguage()
  const { logout } = useAuth()
  const { staffUnreadTotal } = useMessages()
  const location = useLocation()
  const navigate = useNavigate()
  const outlet = useOutlet()
  const [menuOpen, setMenuOpen] = useState(false)

  const doLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-full bg-slate-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col bg-secondary text-white md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <img src={logo} alt="TMK Fitness" className="h-8 w-auto rounded bg-white p-1" />
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
            {t('admin.console')}
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{t(item.labelKey)}</span>
              {item.badge && staffUnreadTotal > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-pink px-1.5 text-xs font-bold text-white">
                  {staffUnreadTotal}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 px-3 py-4">
          <button
            type="button"
            onClick={doLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur safe-top safe-x">
          <div className="flex items-center gap-2 md:hidden">
            <img src={logo} alt="TMK Fitness" className="h-7 w-auto" />
            <span className="tmk-chip bg-secondary/10 text-secondary">
              {t('admin.console')}
            </span>
          </div>
          <span className="hidden font-heading text-lg font-bold uppercase tracking-wide text-secondary md:block">
            {t('admin.console')}
          </span>
          <div className="flex items-center gap-2">
            <LanguageToggle variant="light" />
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary font-heading text-sm font-bold text-white"
              >
                MM
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sheet"
                    >
                      <div className="border-b border-slate-100 px-4 py-2.5">
                        <p className="text-xs text-slate-400">{t('admin.signedInAs')}</p>
                        <p className="font-heading font-semibold text-secondary">Michel Møller</p>
                      </div>
                      <button
                        type="button"
                        onClick={doLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-accent-pink hover:bg-slate-50"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {t('admin.logout')}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content — keyed enter animation per route (no wait-state to wedge). */}
        <div className="flex-1 pb-24 md:pb-6">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mx-auto max-w-4xl"
          >
            {outlet}
          </motion.main>
        </div>

        {/* Bottom nav (mobile) — scrolls horizontally to fit all sections */}
        <nav className="no-scrollbar fixed inset-x-0 bottom-0 z-30 overflow-x-auto border-t border-slate-200 bg-secondary safe-bottom safe-x md:hidden">
          <ul className="flex items-stretch">
            {items.map((item) => (
              <li key={item.to} className="min-w-[62px] flex-1 shrink-0">
                <NavLink
                  to={item.to}
                  end={item.to === '/admin'}
                  className="relative flex flex-col items-center gap-1 py-2.5"
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        <item.icon
                          className={`h-5 w-5 ${isActive ? 'text-accent-teal' : 'text-white/50'}`}
                        />
                        {item.badge && staffUnreadTotal > 0 && (
                          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-pink px-1 text-[10px] font-bold text-white">
                            {staffUnreadTotal}
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-heading text-[10px] font-semibold uppercase tracking-wide ${
                          isActive ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {t(item.labelKey)}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
