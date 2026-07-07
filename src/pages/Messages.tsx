import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ChevronRight, Plus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useAdminData } from '@/context/AdminDataContext'
import { useMessages } from '@/context/MessagesContext'
import { GENERAL, GENERAL_AVATAR } from '@/data/messages'
import { Avatar } from '@/components/ui/Avatar'
import { formatAgo } from '@/lib/dates'
import type { Conversation } from '@/types'

export function Messages() {
  const { t, tc, lang } = useLanguage()
  const { member } = useAuth()
  const { trainers } = useAdminData()
  const { forMember, ensure } = useMessages()
  const navigate = useNavigate()
  const [compose, setCompose] = useState(false)

  const conversations = forMember(member.id)
  const contactable = trainers.filter((tr) => tr.contactable !== false)

  const openWith = (recipient: string) => {
    const id = ensure(member.id, `${member.firstName} ${member.lastName}`, recipient)
    setCompose(false)
    navigate(`/messages/${id}`)
  }

  const recipientMeta = (recipient: string) => {
    const coach = trainers.find((tr) => tr.id === recipient)
    if (recipient === GENERAL || !coach) {
      return {
        name: 'TMK Fitness',
        avatar: { firstName: 'TMK', lastName: 'Fitness', avatar: GENERAL_AVATAR },
      }
    }
    return {
      name: coach.name,
      avatar: {
        firstName: coach.name.split(' ')[0],
        lastName: coach.name.split(' ').slice(-1)[0],
        avatar: coach.avatar,
      },
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
            {t('messages.title')}
          </h2>
          <p className="text-sm text-slate-500">{t('messages.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setCompose(true)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-white"
        >
          <Plus className="h-4 w-4" />
          {t('messages.new')}
        </button>
      </div>

      <div className="space-y-2">
        {conversations.length === 0 && (
          <div className="tmk-card p-8 text-center text-sm text-slate-400">
            {t('messages.noneMember')}
          </div>
        )}
        {conversations.map((conv, i) => (
          <ConversationRow
            key={conv.id}
            conv={conv}
            meta={recipientMeta(conv.recipient)}
            index={i}
            youLabel={t('leaderboard.you')}
            emptyLabel={t('messages.empty')}
            lang={lang}
          />
        ))}
      </div>

      {/* Compose — recipient picker */}
      <AnimatePresence>
        {compose && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={() => setCompose(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="relative w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-sheet safe-bottom safe-x"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
              <h3 className="mb-3 font-heading text-lg font-bold uppercase tracking-wide text-secondary">
                {t('messages.chooseRecipient')}
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => openWith(GENERAL)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${GENERAL_AVATAR} text-white`}>
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-base font-semibold uppercase tracking-wide text-secondary">
                      TMK Fitness
                    </p>
                    <p className="text-xs text-slate-500">{t('messages.generalDesc')}</p>
                  </div>
                </button>
                {contactable.map((coach) => (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => openWith(coach.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left"
                  >
                    <Avatar
                      member={{
                        firstName: coach.name.split(' ')[0],
                        lastName: coach.name.split(' ').slice(-1)[0],
                        avatar: coach.avatar,
                      }}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="font-heading text-base font-semibold uppercase tracking-wide text-secondary">
                        {coach.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">{tc(coach.role)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ConversationRow({
  conv,
  meta,
  index,
  youLabel,
  emptyLabel,
  lang,
}: {
  conv: Conversation
  meta: { name: string; avatar: { firstName: string; lastName: string; avatar: string } }
  index: number
  youLabel: string
  emptyLabel: string
  lang: 'no' | 'en'
}) {
  const last = conv.messages[conv.messages.length - 1]
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/messages/${conv.id}`} className="tmk-card flex items-center gap-3 p-3">
        <Avatar member={meta.avatar} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate font-heading text-base font-semibold uppercase tracking-wide text-secondary">
              {meta.name}
            </p>
            {last && (
              <span className="shrink-0 text-[11px] text-slate-400">
                {formatAgo(Math.round((Date.now() - last.at) / 60000), lang)}
              </span>
            )}
          </div>
          <p
            className={`truncate text-sm ${
              conv.memberUnread > 0 ? 'font-medium text-secondary' : 'text-slate-500'
            }`}
          >
            {last
              ? `${last.party === 'member' ? `${youLabel}: ` : ''}${last.text}`
              : emptyLabel}
          </p>
        </div>
        {conv.memberUnread > 0 ? (
          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent-pink px-1.5 text-xs font-bold text-white">
            {conv.memberUnread}
          </span>
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
        )}
      </Link>
    </motion.div>
  )
}
