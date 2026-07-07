import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useAdminData } from '@/context/AdminDataContext'
import { classById } from '@/data/classes'
import { timetable } from '@/data/timetable'
import { convId } from '@/data/messages'

export function TrainerDetail() {
  const { id } = useParams()
  const { t, tc } = useLanguage()
  const { member } = useAuth()
  const { trainers } = useAdminData()
  const navigate = useNavigate()

  const trainer = trainers.find((tr) => tr.id === id) ?? trainers[0]

  // Classes this trainer instructs (match timetable first-name instructors).
  const classesTaught = useMemo(() => {
    const ids = new Set(
      timetable
        .filter((s) => trainer.name.startsWith(s.instructor))
        .map((s) => s.classId),
    )
    return Array.from(ids).map((cid) => classById(cid))
  }, [trainer])

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

      {/* Header */}
      <section className="flex flex-col items-center pt-2 text-center">
        <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${trainer.avatar} font-heading text-3xl font-bold uppercase text-white shadow-card`}>
          {trainer.initials}
        </div>
        <h2 className="mt-3 font-heading text-2xl font-bold uppercase text-secondary">
          {trainer.name}
        </h2>
        <p className="mt-0.5 text-sm text-primary">{tc(trainer.role)}</p>
      </section>

      {/* About */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('trainer.about')}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">{tc(trainer.bio)}</p>
      </section>

      {/* Specialties */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('trainer.specialties')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tc(trainer.specialties)
            .split('·')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => (
              <span key={s} className="tmk-chip bg-primary/10 text-primary">
                {s}
              </span>
            ))}
        </div>
      </section>

      {/* Classes taught */}
      {classesTaught.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {classesTaught.map((c) => (
            <Link
              key={c.id}
              to={`/class/${c.id}`}
              className={`tmk-chip bg-gradient-to-br ${c.accent} text-white`}
            >
              {tc(c.name)}
            </Link>
          ))}
        </section>
      )}

      {/* CTAs */}
      <div className="space-y-3">
        <Link
          to="/treatment"
          className="block w-full rounded-2xl bg-gradient-to-r from-primary to-accent-teal py-4 text-center font-heading text-lg font-bold uppercase tracking-wide text-white shadow-card"
        >
          {t('trainer.book')}
        </Link>
        {trainer.contactable !== false && (
          <Link
            to={`/messages/${convId(member.id, trainer.id)}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-heading font-semibold uppercase tracking-wide text-secondary"
          >
            <MessageSquare className="h-4 w-4" />
            {t('trainer.message')}
          </Link>
        )}
      </div>
    </motion.div>
  )
}
