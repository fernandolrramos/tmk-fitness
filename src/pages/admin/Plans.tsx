import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'
import { plans } from '@/data/plans'
import { PLAN_MONTHLY, formatNOK, membersByPlan, monthlyRevenue } from '@/lib/insights'

export function AdminPlans() {
  const { t, tc, lang } = useLanguage()
  const { members } = useAdminData()

  const byPlan = membersByPlan(members)
  const countFor = (id: string) => byPlan.find((x) => x.plan.id === id)?.count ?? 0
  const maxCount = Math.max(1, ...byPlan.map((p) => p.count))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-secondary md:text-3xl">
          {t('admin.pl.title')}
        </h2>
        <p className="mt-1 text-slate-500">{t('admin.pl.subtitle')}</p>
      </div>

      {/* Total revenue summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="tmk-card bg-gradient-to-br from-primary to-secondary p-5 text-white"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">
          {t('admin.pl.revenue')}
        </p>
        <p className="mt-1 font-heading text-3xl font-bold">
          {formatNOK(monthlyRevenue(members), lang)}
        </p>
      </motion.div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.map((p, i) => {
          const count = countFor(p.id)
          const revenue = count * (PLAN_MONTHLY[p.id] ?? 0)
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`tmk-card p-5 ${p.featured ? 'ring-2 ring-accent-pink' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-secondary">
                  {tc(p.name)}
                </h3>
                {p.featured && (
                  <span className="tmk-chip bg-accent-pink/15 text-accent-pink">
                    {t('admin.pl.featured')}
                  </span>
                )}
              </div>
              <p className="mt-1 font-heading text-xl font-bold text-primary">
                {tc(p.price)}
              </p>
              <p className="mt-1 text-xs text-slate-400">{tc(p.terms)}</p>

              {/* Member count bar */}
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {t('admin.pl.members')}
                  </span>
                  <span className="font-heading text-lg font-bold text-secondary">
                    {count}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent-teal"
                    style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t('admin.pl.revenue')}
                </span>
                <span className="font-heading font-bold text-secondary">
                  {formatNOK(revenue, lang)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
