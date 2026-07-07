import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { useMessages } from '@/context/MessagesContext'
import { GENERAL, GENERAL_AVATAR } from '@/data/messages'
import { Avatar } from '@/components/ui/Avatar'
import { formatAgo } from '@/lib/dates'

export function AdminInbox() {
  const { t, lang } = useLanguage()
  const { conversations } = useMessages()
  const { members, trainers } = useAdminData()
  const [filter, setFilter] = useState<string>('all')

  const chips = useMemo(
    () => [
      { id: 'all', label: t('common.all') },
      { id: GENERAL, label: t('messages.general') },
      ...trainers.map((tr) => ({ id: tr.id, label: tr.name.split(' ')[0] })),
    ],
    [t, trainers],
  )

  const shown = conversations.filter((c) => filter === 'all' || c.recipient === filter)

  const recipientLabel = (recipient: string) =>
    recipient === GENERAL
      ? t('messages.general')
      : (trainers.find((tr) => tr.id === recipient)?.name ?? recipient)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-secondary md:text-3xl">
          {t('inbox.title')}
        </h2>
        <p className="mt-1 text-slate-500">{t('inbox.subtitle')}</p>
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={`shrink-0 rounded-xl px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
              filter === chip.id
                ? 'bg-primary text-white'
                : 'border border-slate-200 text-slate-500'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {shown.length === 0 && (
          <div className="tmk-card p-8 text-center text-sm text-slate-400">
            {t('inbox.empty')}
          </div>
        )}
        {shown.map((conv, i) => {
          const record = members.find((m) => m.id === conv.memberId)
          const last = conv.messages[conv.messages.length - 1]
          return (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/admin/inbox/${conv.id}`} className="tmk-card flex items-center gap-3 p-3">
                {record ? (
                  <Avatar member={record} size="md" />
                ) : (
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${GENERAL_AVATAR} text-white`}>
                    <Building2 className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-medium text-secondary">{conv.memberName}</p>
                    {last && (
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {formatAgo(Math.round((Date.now() - last.at) / 60000), lang)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-wide text-primary">
                    {recipientLabel(conv.recipient)}
                  </p>
                  <p
                    className={`truncate text-sm ${
                      conv.staffUnread > 0 ? 'font-medium text-secondary' : 'text-slate-500'
                    }`}
                  >
                    {last
                      ? `${last.party === 'staff' ? `${t('inbox.staff')}: ` : ''}${last.text}`
                      : t('messages.empty')}
                  </p>
                </div>
                {conv.staffUnread > 0 ? (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent-pink px-1.5 text-xs font-bold text-white">
                    {conv.staffUnread}
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
