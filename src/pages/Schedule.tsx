import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { CalendarOff } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ClassRow } from '@/components/ClassRow'
import { BookingSheet } from '@/components/BookingSheet'
import {
  formatDayHeader,
  formatDayNumber,
  formatWeekdayShort,
  isSameDay,
  sessionsForDate,
  upcomingDays,
} from '@/lib/dates'
import type { DatedSession } from '@/types'

export function Schedule() {
  const { t, lang } = useLanguage()
  const days = useMemo(() => upcomingDays(14), [])
  const [selected, setSelected] = useState<Date>(days[0])
  const [sheet, setSheet] = useState<DatedSession | null>(null)

  const today = new Date()
  // On today's tab, hide classes whose start time has already passed —
  // you can't book a class that has begun, and it avoids confusing "next
  // occurrence" dates for a class that already ran earlier today.
  const sessions = useMemo(() => {
    const all = sessionsForDate(selected)
    if (!isSameDay(selected, today)) return all
    const now = Date.now()
    return all.filter((s) => new Date(s.date).getTime() > now)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-5">
      <div className="px-4">
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
          {t('schedule.title')}
        </h2>
        <p className="text-sm text-slate-500">{t('schedule.subtitle')}</p>
      </div>

      {/* Day pills */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {days.map((day) => {
          const active = isSameDay(day, selected)
          const isToday = isSameDay(day, today)
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => setSelected(day)}
              className={`relative flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors ${
                active
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <span className="text-[10px] font-medium uppercase">
                {formatWeekdayShort(day, lang)}
              </span>
              <span className="font-heading text-xl font-bold tabular-nums">
                {formatDayNumber(day, lang)}
              </span>
              {isToday && (
                <span
                  className={`absolute bottom-1.5 h-1 w-1 rounded-full ${
                    active ? 'bg-white' : 'bg-accent-pink'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Day header */}
      <p className="mt-4 px-4 font-heading text-sm font-semibold uppercase capitalize tracking-wide text-slate-400">
        {formatDayHeader(selected, lang)}
      </p>

      {/* Sessions */}
      <div className="mt-2 space-y-3 px-4">
        {sessions.length === 0 ? (
          <div className="tmk-card flex flex-col items-center p-8 text-center text-slate-400">
            <CalendarOff className="h-8 w-8 text-slate-300" aria-hidden />
            <p className="mt-2 text-sm">{t('schedule.empty')}</p>
          </div>
        ) : (
          sessions.map((s, i) => (
            <ClassRow key={s.id} session={s} index={i} onSelect={setSheet} />
          ))
        )}
      </div>

      <BookingSheet session={sheet} onClose={() => setSheet(null)} />
    </motion.div>
  )
}
