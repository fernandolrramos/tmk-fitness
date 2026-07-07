import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { classById } from '@/data/classes'
import { BookingSheet } from '@/components/BookingSheet'
import {
  formatRelativeDay,
  formatTime,
  sessionsForDate,
  upcomingDays,
} from '@/lib/dates'
import type { DatedSession } from '@/types'

export function ClassDetail() {
  const { id } = useParams()
  const { t, tc, lang } = useLanguage()
  const navigate = useNavigate()
  const [sheet, setSheet] = useState<DatedSession | null>(null)

  const gymClass = classById(id!)

  // Next ~5 upcoming dated sessions of THIS class across the next 14 days
  // (excluding any that have already started today).
  const sessions = useMemo(() => {
    const now = Date.now()
    return upcomingDays(14)
      .flatMap((day) => sessionsForDate(day))
      .filter((s) => s.classId === id && new Date(s.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }, [id])

  const instructors = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.instructor))),
    [sessions],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 font-heading text-sm font-semibold uppercase tracking-wide text-slate-500"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl bg-gradient-to-br ${gymClass.accent} p-6 text-white shadow-card`}
      >
        <h2 className="font-heading text-3xl font-bold uppercase tracking-wide">
          {tc(gymClass.name)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/90">
          {tc(gymClass.description)}
        </p>
      </motion.div>

      {/* Instructor(s) */}
      {instructors.length > 0 && (
        <section>
          <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('classdetail.trainer')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {instructors.map((name) => (
              <span key={name} className="tmk-chip bg-primary/10 text-primary">
                {name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming sessions */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('classdetail.upcoming')}
        </h3>
        {sessions.length === 0 ? (
          <div className="tmk-card p-6 text-center text-sm text-slate-400">
            {t('classdetail.noUpcoming')}
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <motion.button
                key={s.id + s.date}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSheet(s)}
                className="tmk-card flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div>
                  <p className="font-heading text-lg font-bold text-primary tabular-nums">
                    {formatTime(s.date, lang)}
                  </p>
                  <p className="text-xs capitalize text-slate-400">
                    {formatRelativeDay(new Date(s.date), lang)} · {s.instructor}
                  </p>
                </div>
                <span className="tmk-chip bg-slate-100 text-slate-500">
                  {s.spotsLeft <= 0
                    ? t('schedule.full')
                    : s.spotsLeft === 1
                      ? t('schedule.oneSpot')
                      : `${s.spotsLeft} ${t('schedule.spotsLeft')}`}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      <BookingSheet session={sheet} onClose={() => setSheet(null)} />
    </motion.div>
  )
}
