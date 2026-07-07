import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { classById } from '@/data/classes'
import { planById } from '@/data/plans'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  activeMembers,
  fillRate,
  formatNOK,
  membersByPlan,
  monthlyRevenue,
} from '@/lib/insights'
import { formatTime, sessionsForDate } from '@/lib/dates'
import type { MemberRecord } from '@/types'

interface Kpi {
  label: string
  value: string
  delta: string
  positive: boolean
}

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="tmk-card p-4"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {kpi.label}
      </p>
      <p className="mt-1 font-heading text-3xl font-bold text-secondary">{kpi.value}</p>
      <span
        className={`tmk-chip mt-2 ${
          kpi.positive
            ? 'bg-accent-teal/15 text-primary'
            : 'bg-accent-pink/15 text-accent-pink'
        }`}
      >
        {kpi.delta}
      </span>
    </motion.div>
  )
}

export function AdminDashboard() {
  const { t, tc, lang } = useLanguage()
  const { members, bookings } = useAdminData()

  const today = sessionsForDate(new Date())
  const byPlan = membersByPlan(members)
  const maxPlan = Math.max(1, ...byPlan.map((p) => p.count))
  const recent = [...members]
    .sort((a, b) => b.joined.localeCompare(a.joined))
    .slice(0, 4)

  const kpis: Kpi[] = [
    {
      label: t('admin.dash.activeMembers'),
      value: String(activeMembers(members).length),
      delta: `+6% ${t('admin.dash.vsWeek')}`,
      positive: true,
    },
    {
      label: t('admin.dash.bookingsWeek'),
      value: String(bookings.length),
      delta: `+12 ${t('admin.dash.vsWeek')}`,
      positive: true,
    },
    {
      label: t('admin.dash.fillRate'),
      value: `${Math.round(fillRate() * 100)}%`,
      delta: `+4% ${t('admin.dash.vsWeek')}`,
      positive: true,
    },
    {
      label: t('admin.dash.revenueMonth'),
      value: formatNOK(monthlyRevenue(members), lang),
      delta: `+8% ${t('admin.dash.vsWeek')}`,
      positive: true,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-secondary md:text-3xl">
          {t('admin.dash.welcome')}, Michel
        </h2>
        <p className="mt-1 text-slate-500">{t('admin.dash.title')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Today's classes */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="tmk-card p-4"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-secondary">
            {t('admin.dash.today')}
          </h3>
          <div className="mt-3 space-y-3">
            {today.length === 0 && (
              <p className="text-sm text-slate-400">{t('admin.dash.noToday')}</p>
            )}
            {today.map((s, i) => {
              const booked = Math.max(0, s.capacity - s.spotsLeft)
              const pct = Math.round((booked / Math.max(1, s.capacity)) * 100)
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.04 }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium leading-tight text-secondary">
                        {tc(classById(s.classId).name)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatTime(s.date, lang)} · {s.instructor}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {booked}/{s.capacity} {t('admin.dash.booked')}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent-teal"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* By plan */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="tmk-card p-4"
        >
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-secondary">
            {t('admin.dash.byPlan')}
          </h3>
          <div className="mt-3 space-y-3">
            {byPlan.map((p, i) => (
              <motion.div
                key={p.plan.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.17 + i * 0.04 }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-secondary">
                    {tc(p.plan.name)}
                  </p>
                  <span className="shrink-0 text-xs font-medium text-slate-500">
                    {p.count}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-pink to-primary"
                    style={{ width: `${Math.round((p.count / maxPlan) * 100)}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Recent members */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="tmk-card p-4"
      >
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-secondary">
          {t('admin.dash.recent')}
        </h3>
        <div className="mt-3 divide-y divide-slate-100">
          {recent.map((m: MemberRecord, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.04 }}
              className="flex items-center gap-3 py-2.5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${m.avatar} font-heading text-sm font-bold uppercase text-white`}
              >
                {m.firstName[0]}
                {m.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-secondary">
                  {m.firstName} {m.lastName}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {tc(planById(m.planId).name)}
                </p>
              </div>
              <StatusBadge status={m.status} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
