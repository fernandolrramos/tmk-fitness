import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAdminData } from '@/context/AdminDataContext'

export function Trainers() {
  const { t, tc } = useLanguage()
  const { trainers } = useAdminData()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      <div>
        <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-secondary">
          {t('trainers.title')}
        </h2>
        <p className="text-sm text-slate-500">{t('trainers.subtitle')}</p>
      </div>

      <div className="space-y-3">
        {trainers.map((trainer, i) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/trainers/${trainer.id}`}
              className="tmk-card flex items-center gap-4 p-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-teal font-heading text-xl font-bold uppercase text-white">
                {trainer.initials}
              </div>
              <div className="min-w-0">
                <p className="font-heading text-lg font-bold uppercase leading-tight text-secondary">
                  {trainer.name}
                </p>
                <p className="text-sm text-primary">{tc(trainer.role)}</p>
                <p className="mt-1 text-xs leading-snug text-slate-400">
                  {tc(trainer.specialties)}
                </p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 shrink-0 self-center text-slate-300" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
