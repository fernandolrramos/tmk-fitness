import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarPlus,
  Dumbbell,
  Flame,
  HeartPulse,
  MapPin,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { classById } from '@/data/classes'
import { planById } from '@/data/plans'
import { quoteOfTheDay } from '@/data/quotes'
import { streak } from '@/data/social'
import { Countdown } from '@/components/Countdown'
import { formatRelativeDay, formatTime } from '@/lib/dates'
import type { DatedSession } from '@/types'
import type { TranslationKey } from '@/i18n/translations'

function greetingKey(): TranslationKey {
  const h = new Date().getHours()
  if (h < 10) return 'greeting.morning'
  if (h >= 18) return 'greeting.evening'
  return 'greeting.day'
}

const quickActions: {
  to: string
  labelKey: TranslationKey
  icon: LucideIcon
  accent: string
}[] = [
  { to: '/trainers', labelKey: 'home.trainers', icon: Dumbbell, accent: 'from-primary to-accent-teal' },
  { to: '/treatment', labelKey: 'home.treatments', icon: HeartPulse, accent: 'from-accent-pink to-primary' },
  { to: '/membership', labelKey: 'home.membership', icon: Star, accent: 'from-accent-teal to-accent-pink' },
  { to: '/contact', labelKey: 'home.contact', icon: MapPin, accent: 'from-secondary to-primary' },
]

export function Home() {
  const { t, tc } = useLanguage()
  const { member } = useAuth()
  const { next, upcoming } = useBooking()
  const navigate = useNavigate()

  const plan = planById(member.planId)
  const quote = quoteOfTheDay(new Date())

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      {/* Greeting + membership chip */}
      <section>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary"
        >
          {t(greetingKey())}, {member.firstName}!
        </motion.h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="tmk-chip bg-accent-pink/10 text-accent-pink">
            <Flame className="h-3.5 w-3.5 fill-current" />
            {streak.current} {t(streak.current === 1 ? 'streak.week' : 'streak.weeks')}
          </span>
          <span className="tmk-chip bg-primary/10 text-primary">
            <Star className="h-3.5 w-3.5 fill-current" />
            {tc(plan.name)}
          </span>
        </div>
      </section>

      {/* Next class card with live countdown */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('home.nextClass')}
        </h3>
        {next ? (
          <NextClassCard session={next} />
        ) : (
          <button
            type="button"
            onClick={() => navigate('/schedule')}
            className="tmk-card flex w-full flex-col items-center gap-2 p-6 text-center"
          >
            <CalendarPlus className="h-8 w-8 text-primary" aria-hidden />
            <p className="font-heading font-semibold uppercase text-secondary">
              {t('home.noNextClass')}
            </p>
            <span className="text-sm text-primary">{t('home.noNextClassCta')}</span>
          </button>
        )}
      </section>

      {/* Upcoming carousel */}
      {upcoming.length > 0 && (
        <section>
          <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('home.upcoming')}
          </h3>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
            {upcoming.map((s, i) => (
              <UpcomingCard key={s.id + s.date} session={s} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Primary CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => navigate('/schedule')}
        className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent-teal py-4 font-heading text-lg font-bold uppercase tracking-wide text-white shadow-card"
      >
        {t('home.bookCta')}
      </motion.button>

      {/* Quick actions */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('home.quickActions')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((qa, i) => (
            <motion.div
              key={qa.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={qa.to}
                className="tmk-card flex items-center gap-3 p-4"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${qa.accent}`}>
                  <qa.icon className="h-5 w-5 text-white" />
                </span>
                <span className="font-heading text-sm font-semibold uppercase leading-tight tracking-wide text-secondary">
                  {t(qa.labelKey)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily motivation */}
      <section className="rounded-2xl bg-secondary p-5 text-white">
        <p className="mb-1 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-accent-pink">
          {t('home.motivation')}
        </p>
        <p className="font-heading text-xl font-semibold leading-snug">
          “{tc(quote)}”
        </p>
      </section>
    </motion.div>
  )
}

function NextClassCard({ session }: { session: DatedSession }) {
  const { t, tc, lang } = useLanguage()
  const gymClass = classById(session.classId)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`overflow-hidden rounded-2xl bg-gradient-to-br ${gymClass.accent} p-5 text-white shadow-card`}
    >
      <div className="flex items-baseline justify-between">
        <h4 className="font-heading text-2xl font-bold uppercase tracking-wide">
          {tc(gymClass.name)}
        </h4>
        <span className="text-sm font-medium capitalize text-white/80">
          {formatRelativeDay(new Date(session.date), lang)}
        </span>
      </div>
      <p className="mt-0.5 text-sm text-white/85">
        {formatTime(session.date, lang)}–{session.end} · {t('home.instructor')}{' '}
        {session.instructor}
      </p>
      <div className="mt-4">
        <Countdown iso={session.date} />
      </div>
    </motion.div>
  )
}

function UpcomingCard({ session, index }: { session: DatedSession; index: number }) {
  const { tc, lang } = useLanguage()
  const gymClass = classById(session.classId)

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="tmk-card w-44 shrink-0 snap-start p-4"
    >
      <div className={`mb-2 h-1.5 w-10 rounded-full bg-gradient-to-r ${gymClass.accent}`} />
      <p className="font-heading text-base font-semibold uppercase leading-tight text-secondary">
        {tc(gymClass.name)}
      </p>
      <p className="mt-1 text-xs capitalize text-slate-400">
        {formatRelativeDay(new Date(session.date), lang)}
      </p>
      <p className="mt-2 font-heading text-lg font-bold text-primary tabular-nums">
        {formatTime(session.date, lang)}
      </p>
      <p className="text-xs text-slate-500">{session.instructor}</p>
    </motion.div>
  )
}
