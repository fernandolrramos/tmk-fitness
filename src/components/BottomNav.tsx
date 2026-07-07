import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CalendarCheck,
  CalendarDays,
  Home,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import type { TranslationKey } from '@/i18n/translations'

interface Tab {
  to: string
  labelKey: TranslationKey
  icon: LucideIcon
}

const tabs: Tab[] = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/schedule', labelKey: 'nav.schedule', icon: CalendarDays },
  { to: '/community', labelKey: 'nav.community', icon: Users },
  { to: '/bookings', labelKey: 'nav.bookings', icon: CalendarCheck },
  { to: '/profile', labelKey: 'nav.profile', icon: User },
]

/** Fixed 4-tab member bottom navigation. */
export function BottomNav() {
  const { t } = useLanguage()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur safe-bottom safe-x">
      <ul className="mx-auto flex max-w-lg items-stretch">
        {tabs.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.to === '/'}
              className="relative flex flex-col items-center gap-1 py-2.5"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                    />
                  )}
                  <tab.icon
                    className={`h-6 w-6 ${isActive ? 'text-primary stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`}
                  />
                  <span
                    className={`font-heading text-[11px] font-semibold uppercase tracking-wide ${
                      isActive ? 'text-primary' : 'text-slate-400'
                    }`}
                  >
                    {t(tab.labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
