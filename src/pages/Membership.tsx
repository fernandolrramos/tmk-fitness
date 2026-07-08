import { motion } from 'framer-motion'
import { Check, ExternalLink, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { plans, planById } from '@/data/plans'
import type { TranslationKey } from '@/i18n/translations'

/** TMK's real online enrolment / membership-change page. */
const ENROLL_URL = 'https://tmkfitness.ibooking.no/nettinnmelding'

const PERK_KEYS: TranslationKey[] = [
  'membership.perk1',
  'membership.perk2',
  'membership.perk3',
]

export function Membership() {
  const { t, tc } = useLanguage()
  const { member } = useAuth()

  const current = planById(member.planId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
        {t('membership.title')}
      </h2>

      {/* Current plan */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('membership.current')}
        </h3>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-card">
          <p className="font-heading text-2xl font-bold uppercase tracking-wide">
            {tc(current.name)}
          </p>
          <p className="mt-1 text-lg text-white/90">{tc(current.price)}</p>
          <p className="mt-0.5 text-sm text-white/70">{tc(current.terms)}</p>
        </div>
      </section>

      {/* Perks */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('membership.perks')}
        </h3>
        <ul className="tmk-card divide-y divide-slate-100 p-1">
          {PERK_KEYS.map((key) => (
            <li key={key} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-teal/15 text-accent-teal">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm text-slate-600">{t(key)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* All plans */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('membership.allPlans')}
        </h3>
        <div className="space-y-3">
          {plans.map((plan, i) => {
            const isCurrent = plan.id === member.planId
            return (
              <motion.a
                key={plan.id}
                href={ENROLL_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="tmk-card flex w-full items-center justify-between gap-3 p-4 text-left transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-lg font-bold uppercase leading-tight text-secondary">
                      {tc(plan.name)}
                    </p>
                    {plan.featured && (
                      <span className="tmk-chip bg-accent-pink/10 text-accent-pink">
                        <Star className="h-3 w-3 fill-current" />
                        {t('admin.pl.featured')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary">{tc(plan.price)}</p>
                  <p className="text-xs text-slate-400">{tc(plan.terms)}</p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wide ${
                    isCurrent ? 'bg-primary/10 text-primary' : 'bg-secondary text-white'
                  }`}
                >
                  {isCurrent ? t('membership.current') : t('membership.upgrade')}
                  {!isCurrent && <ExternalLink className="h-3 w-3" />}
                </span>
              </motion.a>
            )
          })}
        </div>
      </section>
    </motion.div>
  )
}
