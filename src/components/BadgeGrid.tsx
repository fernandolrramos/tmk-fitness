import { motion } from 'framer-motion'
import {
  Bike,
  Flame,
  HandHeart,
  Lock,
  Medal,
  Sparkles,
  Sunrise,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { badges } from '@/data/social'

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Sunrise,
  Flame,
  HandHeart,
  Medal,
  Bike,
}

/** Achievement badges grid — earned in colour, locked greyed with progress. */
export function BadgeGrid() {
  const { tc } = useLanguage()

  return (
    <div className="grid grid-cols-3 gap-3">
      {badges.map((badge, i) => {
        const Icon = ICONS[badge.icon] ?? Sparkles
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`tmk-card flex flex-col items-center p-3 text-center ${
              badge.earned ? '' : 'opacity-70'
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                badge.earned
                  ? 'bg-gradient-to-br from-primary to-accent-teal text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {badge.earned ? (
                <Icon className="h-6 w-6" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
            <p className="mt-2 font-heading text-xs font-semibold uppercase leading-tight tracking-wide text-secondary">
              {tc(badge.name)}
            </p>
            {badge.earned ? (
              <p className="mt-0.5 text-[10px] text-slate-400">{tc(badge.description)}</p>
            ) : (
              badge.progress && (
                <>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.round(
                          (badge.progress.value / badge.progress.target) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {badge.progress.value}/{badge.progress.target}
                  </p>
                </>
              )
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
