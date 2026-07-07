import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { useMessages } from '@/context/MessagesContext'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageToggle } from './LanguageToggle'

/** Official logo lives in public/ — reference by URL, not import. */
const logo = '/brand/logo.png'

/** Sticky member-app header with the official TMK Fitness logo. */
export function Header() {
  const { memberUnreadTotal } = useMessages()
  const { member } = useAuth()
  const { t } = useLanguage()
  const totalUnread = memberUnreadTotal(member.id)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur safe-top safe-x">
      <div className="flex items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="TMK Fitness"
            className="h-9 w-auto"
            width={128}
            height={42}
          />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/messages"
            aria-label={t('messages.title')}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-slate-100"
          >
            <MessageSquare className="h-5 w-5" />
            {totalUnread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-pink px-1 text-[10px] font-bold text-white">
                {totalUnread}
              </span>
            )}
          </Link>
          <LanguageToggle variant="light" />
        </div>
      </div>
    </header>
  )
}
