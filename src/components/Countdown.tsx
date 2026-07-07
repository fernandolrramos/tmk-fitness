import { AnimatePresence, motion } from 'framer-motion'
import { useCountdown } from '@/hooks/useCountdown'
import { useLanguage } from '@/context/LanguageContext'
import type { TranslationKey } from '@/i18n/translations'

function Unit({ value, labelKey }: { value: number; labelKey: TranslationKey }) {
  const { t } = useLanguage()
  const padded = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-10 w-11 overflow-hidden rounded-lg bg-white/15 font-heading text-2xl font-bold tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-white/60">
        {t(labelKey)}
      </span>
    </div>
  )
}

/** Live days/hours/min/sec countdown to an ISO date-time. */
export function Countdown({ iso }: { iso: string }) {
  const { t } = useLanguage()
  const left = useCountdown(iso)

  if (!left || left.total <= 0) {
    return (
      <p className="font-heading text-lg font-semibold uppercase text-white">
        {t('count.startsNow')}
      </p>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Unit value={left.days} labelKey="count.days" />
      <span className="pb-4 text-white/40">:</span>
      <Unit value={left.hours} labelKey="count.hours" />
      <span className="pb-4 text-white/40">:</span>
      <Unit value={left.minutes} labelKey="count.minutes" />
      <span className="pb-4 text-white/40">:</span>
      <Unit value={left.seconds} labelKey="count.seconds" />
    </div>
  )
}
