import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { classById } from '@/data/classes'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { buddiesGoing, youAsAttendee } from '@/lib/social'
import { formatDayHeader, formatTime } from '@/lib/dates'
import { AvatarStack } from '@/components/ui/Avatar'
import type { DatedSession } from '@/types'

type Status = 'idle' | 'confirming' | 'success'

/** Bottom-sheet modal: class details → confirm booking → success state. */
export function BookingSheet({
  session,
  onClose,
}: {
  session: DatedSession | null
  onClose: () => void
}) {
  const { t, tc, lang } = useLanguage()
  const { member } = useAuth()
  const { isBooked, book, cancel } = useBooking()
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (session) setStatus('idle')
  }, [session])

  if (!session) return null

  const gymClass = classById(session.classId)
  const booked = isBooked(session.id, session.date)
  const spotsLeft = Math.max(0, session.spotsLeft - (booked ? 1 : 0))
  const full = spotsLeft <= 0 && !booked
  const buddies = session.capacity > 1 ? buddiesGoing(session.id) : []
  const going = booked && session.capacity > 1 ? [youAsAttendee(member), ...buddies] : buddies

  const handleConfirm = () => {
    setStatus('confirming')
    window.setTimeout(() => {
      book(session)
      setStatus('success')
      window.setTimeout(onClose, 1400)
    }, 650)
  }

  const handleCancel = () => {
    cancel(session.id, session.date)
    onClose()
  }

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-sheet safe-bottom safe-x"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-primary"
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="h-10 w-10"
                      fill="none"
                    >
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
                  <h3 className="mt-4 font-heading text-2xl font-bold uppercase text-secondary">
                    {t('sheet.success')}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{t('sheet.successBody')}</p>
                </motion.div>
              ) : (
                <motion.div key="details" exit={{ opacity: 0 }}>
                  <div className={`mb-4 rounded-2xl bg-gradient-to-br ${gymClass.accent} p-4 text-white`}>
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-wide">
                      {tc(gymClass.name)}
                    </h3>
                    <p className="mt-1 text-sm text-white/85">{tc(gymClass.description)}</p>
                  </div>

                  <dl className="space-y-2.5 text-sm">
                    <Row label={t('sheet.when')}>
                      <span className="capitalize">
                        {formatDayHeader(new Date(session.date), lang)} ·{' '}
                        {formatTime(session.date, lang)}–{session.end}
                      </span>
                    </Row>
                    <Row label={t('sheet.instructor')}>{session.instructor}</Row>
                    <Row label={t('sheet.spots')}>
                      {full ? t('schedule.full') : `${spotsLeft} / ${session.capacity}`}
                      {session.freeForMembers && (
                        <span className="ml-2 text-accent-teal">{t('schedule.free')}</span>
                      )}
                    </Row>
                  </dl>

                  {going.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5">
                      <AvatarStack members={going} max={4} size="sm" />
                      <span className="text-sm text-primary">
                        {going.map((b) => b.firstName).join(', ')} · {going.length}{' '}
                        {t(going.length === 1 ? 'sheet.friendGoing' : 'sheet.friendsGoing')}
                      </span>
                    </div>
                  )}

                  <div className="mt-5">
                    {booked ? (
                      <div className="space-y-2">
                        <p className="text-center text-sm text-primary">
                          {t('sheet.alreadyBooked')}
                        </p>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="w-full rounded-xl border border-slate-200 py-3 font-heading font-semibold uppercase tracking-wide text-slate-600"
                        >
                          {t('sheet.cancel')}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={full || status === 'confirming'}
                        onClick={handleConfirm}
                        className="w-full rounded-xl bg-primary py-3.5 font-heading text-lg font-semibold uppercase tracking-wide text-white transition-opacity disabled:opacity-50"
                      >
                        {full
                          ? t('schedule.full')
                          : status === 'confirming'
                            ? t('sheet.confirming')
                            : t('sheet.confirm')}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2.5">
      <dt className="font-heading font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="text-right font-medium text-secondary">{children}</dd>
    </div>
  )
}
