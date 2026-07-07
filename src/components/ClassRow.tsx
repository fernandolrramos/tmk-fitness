import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { classById } from '@/data/classes'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { buddiesGoing, youAsAttendee } from '@/lib/social'
import { formatTime } from '@/lib/dates'
import { AvatarStack } from '@/components/ui/Avatar'
import type { DatedSession } from '@/types'

interface Props {
  session: DatedSession
  index: number
  onSelect: (session: DatedSession) => void
}

/** A single tappable session row in the schedule list. */
export function ClassRow({ session, index, onSelect }: Props) {
  const { t, tc, lang } = useLanguage()
  const { member } = useAuth()
  const { isBooked } = useBooking()

  const gymClass = classById(session.classId)
  const booked = isBooked(session.id, session.date)
  // Counts derive from booking state so they update the moment you book.
  const spotsLeft = Math.max(0, session.spotsLeft - (booked ? 1 : 0))
  const full = spotsLeft <= 0 && !booked
  const low = !full && spotsLeft > 0 && spotsLeft <= 3
  const buddies = session.capacity > 1 ? buddiesGoing(session.id) : []
  const going =
    session.capacity > 1 && booked ? [youAsAttendee(member), ...buddies] : buddies

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: full ? 1 : 0.98 }}
      disabled={full}
      onClick={() => onSelect(session)}
      className={`tmk-card flex w-full items-stretch gap-3 overflow-hidden p-0 text-left ${
        full ? 'opacity-60' : ''
      }`}
    >
      <div className={`w-1.5 shrink-0 bg-gradient-to-b ${gymClass.accent}`} />
      <div className="flex min-w-0 flex-1 items-center gap-3 py-3 pr-3">
        <div className="w-14 shrink-0">
          <p className="font-heading text-base font-bold text-secondary tabular-nums">
            {formatTime(session.date, lang)}
          </p>
          <p className="text-[11px] text-slate-400">{session.end}</p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-base font-semibold uppercase leading-tight tracking-wide text-secondary">
            {tc(gymClass.name)}
          </p>
          <p className="text-xs leading-snug text-slate-500">
            {t('sheet.instructor')}: {session.instructor}
            {session.freeForMembers && (
              <span className="ml-1 text-accent-teal">· {t('schedule.free')}</span>
            )}
          </p>
          {going.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <AvatarStack members={going} max={3} />
              <span className="text-[11px] font-medium text-primary">
                {going.length} {t('schedule.going')}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          {booked ? (
            <span className="tmk-chip bg-primary/10 text-primary">
              <Check className="h-3.5 w-3.5" />
              {t('schedule.booked')}
            </span>
          ) : full ? (
            <span className="tmk-chip bg-slate-200 text-slate-500">
              {t('schedule.full')}
            </span>
          ) : (
            <span
              className={`tmk-chip ${
                low ? 'bg-accent-pink/15 text-accent-pink' : 'bg-accent-teal/15 text-primary'
              }`}
            >
              {spotsLeft}{' '}
              {spotsLeft === 1 ? t('schedule.oneSpot') : t('schedule.spotsLeft')}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
