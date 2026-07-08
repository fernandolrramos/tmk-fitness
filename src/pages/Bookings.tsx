import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, CalendarDays, Check, type LucideIcon } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useBooking } from '@/context/BookingContext'
import { classById } from '@/data/classes'
import { formatRelativeDay, formatTime } from '@/lib/dates'
import type { DatedSession } from '@/types'

type Tab = 'upcoming' | 'past'

export function Bookings() {
  const { t } = useLanguage()
  const { upcoming, toCheckIn, attended, cancel, checkIn } = useBooking()
  const [tab, setTab] = useState<Tab>('upcoming')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
        {t('bookings.title')}
      </h2>

      {/* Segmented tabs */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
        {(['upcoming', 'past'] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-xl py-2.5 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
              tab === key ? 'bg-white text-primary shadow-card' : 'text-slate-500'
            }`}
          >
            {t(key === 'upcoming' ? 'bookings.upcoming' : 'bookings.past')}
          </button>
        ))}
      </div>

      {tab === 'upcoming' ? (
        toCheckIn.length + upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            message={t('bookings.empty')}
            ctaLabel={t('bookings.browse')}
          />
        ) : (
          <div className="space-y-3">
            {toCheckIn.map((s, i) => (
              <BookingCard
                key={s.id + s.date}
                session={s}
                index={i}
                onCheckIn={() => checkIn(s.id, s.date)}
              />
            ))}
            {upcoming.map((s, i) => (
              <BookingCard
                key={s.id + s.date}
                session={s}
                index={toCheckIn.length + i}
                onCancel={() => cancel(s.id, s.date)}
              />
            ))}
          </div>
        )
      ) : attended.length === 0 ? (
        <EmptyState icon={CalendarCheck} message={t('bookings.emptyPast')} />
      ) : (
        <div className="space-y-3">
          {attended.map((s, i) => (
            <BookingCard key={s.id + s.date} session={s} index={i} completed />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function BookingCard({
  session,
  index,
  onCancel,
  onCheckIn,
  completed,
}: {
  session: DatedSession
  index: number
  onCancel?: () => void
  onCheckIn?: () => void
  completed?: boolean
}) {
  const { t, tc, lang } = useLanguage()
  const gymClass = classById(session.classId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="tmk-card flex overflow-hidden"
    >
      {/* Accent color bar */}
      <div className={`w-1.5 shrink-0 bg-gradient-to-b ${gymClass.accent}`} />

      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-heading text-lg font-semibold uppercase leading-tight text-secondary">
              {tc(gymClass.name)}
            </p>
            {completed && (
              <span className="tmk-chip bg-accent-teal/10 text-accent-teal">
                <Check className="h-3.5 w-3.5" />
                {t('bookings.completed')}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm capitalize text-slate-500">
            {formatRelativeDay(new Date(session.date), lang)} ·{' '}
            {formatTime(session.date, lang)}
          </p>
          <p className="text-xs text-slate-400">{session.instructor}</p>
        </div>

        {onCheckIn && (
          <button
            type="button"
            onClick={onCheckIn}
            className="shrink-0 rounded-xl bg-primary px-3 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            {t('bookings.checkIn')}
          </button>
        )}

        {!completed && !onCheckIn && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:border-accent-pink hover:text-accent-pink"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </motion.div>
  )
}

function EmptyState({
  icon: Icon,
  message,
  ctaLabel,
}: {
  icon: LucideIcon
  message: string
  ctaLabel?: string
}) {
  return (
    <div className="tmk-card flex flex-col items-center gap-3 p-8 text-center">
      <Icon className="h-9 w-9 text-slate-300" aria-hidden />
      <p className="text-sm text-slate-500">{message}</p>
      {ctaLabel && (
        <Link
          to="/schedule"
          className="rounded-xl bg-primary px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-white"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
