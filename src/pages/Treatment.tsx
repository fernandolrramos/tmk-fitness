import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { treatments, treatmentSlots } from '@/data/treatments'
import { nextOccurrence, formatDayHeader, formatTime } from '@/lib/dates'
import type { Session, Treatment as TreatmentType, TreatmentSlot } from '@/types'

/** The next real occurrence Date for a treatment slot. */
function slotDate(slot: TreatmentSlot): Date {
  return nextOccurrence({ weekday: slot.weekday, start: slot.start } as Session)
}

/** Resolve a treatment slot's next real occurrence as a formatted string. */
function slotWhen(slot: TreatmentSlot, lang: 'no' | 'en'): string {
  const date = slotDate(slot)
  return `${formatDayHeader(date, lang)} · ${formatTime(date.toISOString(), lang)}`
}

export function Treatment() {
  const { t } = useLanguage()
  const [openId, setOpenId] = useState<string | null>(null)
  const [bookedSlot, setBookedSlot] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <div>
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
          {t('treatment.title')}
        </h2>
        <p className="text-sm text-slate-500">{t('treatment.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {treatments.map((treatment, i) => (
          <TreatmentCard
            key={treatment.id}
            treatment={treatment}
            index={i}
            open={openId === treatment.id}
            onToggle={() =>
              setOpenId((cur) => (cur === treatment.id ? null : treatment.id))
            }
            bookedSlot={bookedSlot}
            onBook={setBookedSlot}
          />
        ))}
      </div>
    </motion.div>
  )
}

function TreatmentCard({
  treatment,
  index,
  open,
  onToggle,
  bookedSlot,
  onBook,
}: {
  treatment: TreatmentType
  index: number
  open: boolean
  onToggle: () => void
  bookedSlot: string | null
  onBook: (slotId: string) => void
}) {
  const { t, tc, lang } = useLanguage()
  const slots = treatmentSlots
    .filter((s) => s.treatmentId === treatment.id)
    .sort((a, b) => slotDate(a).getTime() - slotDate(b).getTime())
  const justBooked = slots.some((s) => s.id === bookedSlot)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="tmk-card overflow-hidden"
    >
      {/* Accent header */}
      <button
        type="button"
        onClick={onToggle}
        className={`block w-full bg-gradient-to-br ${treatment.accent} p-5 text-left text-white`}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-bold uppercase tracking-wide">
            {tc(treatment.name)}
          </h3>
          <span className="shrink-0 font-heading text-lg font-bold">
            {tc(treatment.price)}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/85">{tc(treatment.description)}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/20 px-2.5 py-1">
            {treatment.duration} {t('common.min')}
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-1">
            {t('treatment.with')} {treatment.provider}
          </span>
        </div>
      </button>

      {/* Slot picker / success */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {justBooked ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary"
                  >
                    <motion.svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                      <motion.path
                        d="M5 12.5 10 17.5 19 7"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                      />
                    </motion.svg>
                  </motion.div>
                  <p className="mt-3 font-heading text-lg font-bold uppercase text-secondary">
                    {t('treatment.booked')}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
                    {t('treatment.choose')}
                  </p>
                  {slots.length === 0 ? (
                    <p className="py-2 text-sm text-slate-400">—</p>
                  ) : (
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => onBook(slot.id)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm capitalize text-secondary transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          <span>{slotWhen(slot, lang)}</span>
                          <span className="font-heading text-xs font-semibold uppercase tracking-wide text-primary">
                            {t('treatment.book')}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
