import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { classById } from '@/data/classes'
import { planById } from '@/data/plans'
import { formatWeekdayShort, upcomingDays } from '@/lib/dates'

const WEEKDAY_COUNT = 7

function weekdayLabels(lang: 'no' | 'en'): { weekday: number; label: string }[] {
  const days = upcomingDays(WEEKDAY_COUNT)
  const out: { weekday: number; label: string }[] = []
  for (let weekday = 0; weekday < WEEKDAY_COUNT; weekday++) {
    const jsDay = (weekday + 1) % 7
    const date = days.find((d) => d.getDay() === jsDay) ?? days[0]
    out.push({ weekday, label: formatWeekdayShort(date, lang) })
  }
  return out
}

export function AdminBookings() {
  const { t, tc, lang } = useLanguage()
  const { sessions, bookings, members, toggleCheckIn } = useAdminData()

  const todayWeekday = (new Date().getDay() + 6) % 7
  const [weekday, setWeekday] = useState(todayWeekday)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const labels = useMemo(() => weekdayLabels(lang), [lang])

  const daySessions = useMemo(
    () =>
      sessions
        .filter((s) => s.weekday === weekday)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [sessions, weekday],
  )

  const roster = useMemo(
    () => bookings.filter((b) => b.sessionId === selectedSession),
    [bookings, selectedSession],
  )

  const session = daySessions.find((s) => s.id === selectedSession)
  const presentCount = roster.filter((b) => b.checkedIn).length
  const booked = session ? Math.max(0, session.capacity - session.spotsLeft) : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-secondary md:text-3xl">
          {t('admin.bk.title')}
        </h2>
        <p className="mt-1 text-slate-500">{t('admin.bk.subtitle')}</p>
      </div>

      {/* Weekday selector */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {labels.map((d) => (
          <button
            key={d.weekday}
            type="button"
            onClick={() => {
              setWeekday(d.weekday)
              setSelectedSession(null)
            }}
            className={`shrink-0 rounded-xl px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide transition-colors ${
              weekday === d.weekday
                ? 'bg-primary text-white'
                : 'border border-slate-200 text-slate-500'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Session list */}
        <div className="min-w-0 space-y-2 lg:col-span-2">
          {daySessions.map((s, i) => {
            const b = Math.max(0, s.capacity - s.spotsLeft)
            const active = s.id === selectedSession
            return (
              <motion.button
                key={s.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedSession(s.id)}
                className={`tmk-card flex w-full items-center gap-3 p-3 text-left transition-shadow ${
                  active ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="min-w-[52px] font-heading text-base font-bold text-secondary">
                  {s.start}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-secondary">
                    {tc(classById(s.classId).name)}
                  </p>
                  <p className="text-xs text-slate-400">{s.instructor}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-500">
                  {b}/{s.capacity}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Roster */}
        <div className="min-w-0 lg:col-span-3">
          {!session && (
            <div className="tmk-card p-8 text-center text-sm text-slate-400">
              {t('admin.bk.selectClass')}
            </div>
          )}
          {session && (
            <div className="tmk-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-secondary">
                    {tc(classById(session.classId).name)}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {session.start}–{session.end} · {session.instructor}
                  </p>
                </div>
                <div className="text-right text-xs font-medium text-slate-500">
                  <p>
                    {presentCount} {t('admin.bk.present')}
                  </p>
                  <p>
                    {booked}/{session.capacity} {t('admin.bk.filled')}
                  </p>
                </div>
              </div>

              {roster.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">
                  {t('admin.bk.noBookings')}
                </p>
              )}

              <div className="divide-y divide-slate-100">
                {roster.map((b, i) => {
                  const member = members.find((m) => m.id === b.memberId)
                  if (!member) return null
                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${member.avatar} font-heading text-sm font-bold uppercase text-white`}
                      >
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-secondary">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {tc(planById(member.planId).name)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCheckIn(b.id)}
                        className={`shrink-0 rounded-lg px-3 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide transition-colors ${
                          b.checkedIn
                            ? 'bg-accent-teal text-white'
                            : 'border border-slate-200 text-slate-600'
                        }`}
                      >
                        {b.checkedIn ? t('admin.bk.checkedIn') : t('admin.bk.checkIn')}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
