import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, SendHorizontal } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar } from '@/components/ui/Avatar'
import { localeFor } from '@/lib/dates'
import type { ChatMessage, ChatParty } from '@/types'

interface AvatarMember {
  firstName: string
  lastName: string
  avatar: string
  photo?: string
}

function timeOf(at: number, lang: 'no' | 'en'): string {
  return new Intl.DateTimeFormat(localeFor(lang), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(at))
}

/**
 * Full-screen chat column reused by the member thread and the staff inbox
 * thread. `viewer` decides which bubbles are right-aligned ("mine").
 */
export function ChatConversation({
  onBack,
  avatar,
  title,
  subtitle,
  messages,
  viewer,
  onSend,
}: {
  onBack: () => void
  avatar: AvatarMember
  title: string
  subtitle?: string
  messages: ChatMessage[]
  viewer: ChatParty
  onSend: (text: string) => void
}) {
  const { t, lang } = useLanguage()
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col bg-slate-100">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur safe-top safe-x">
        <button
          type="button"
          onClick={onBack}
          aria-label={t('common.back')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar member={avatar} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-bold uppercase tracking-wide text-secondary">
            {title}
          </p>
          {subtitle && <p className="truncate text-[11px] text-accent-teal">{subtitle}</p>}
        </div>
      </header>

      <div className="flex-1 space-y-2 px-4 py-4">
        {messages.map((m, i) => (
          <Bubble
            key={m.id}
            message={m}
            mine={m.party === viewer}
            time={timeOf(m.at, lang)}
            index={i}
          />
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={submit}
        className="sticky bottom-0 flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5 safe-bottom safe-x"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('messages.placeholder')}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label={t('messages.send')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

function Bubble({
  message,
  mine,
  time,
  index,
}: {
  message: ChatMessage
  mine: boolean
  time: string
  index: number
}) {
  // Show who replied on incoming staff messages (e.g. "Michel Møller").
  const sender = !mine && message.party === 'staff' ? message.senderName : undefined
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
          mine
            ? 'rounded-br-md bg-primary text-white'
            : 'rounded-bl-md bg-white text-secondary shadow-card'
        }`}
      >
        {sender && (
          <p className="mb-0.5 text-[11px] font-semibold text-primary">{sender}</p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p className={`mt-0.5 text-[10px] ${mine ? 'text-white/70' : 'text-slate-400'}`}>
          {time}
        </p>
      </div>
    </motion.div>
  )
}
