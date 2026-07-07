import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import type { Lang } from '@/types'

const OPTIONS: Lang[] = ['no', 'en']

/** Compact segmented NO | EN control. */
export function LanguageToggle({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang, setLang } = useLanguage()
  const isDark = variant === 'dark'

  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative flex rounded-full p-0.5 text-xs font-heading font-semibold uppercase tracking-wide ${
        isDark ? 'bg-white/10' : 'bg-slate-200'
      }`}
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            className={`relative z-10 min-w-[2.4rem] rounded-full px-2.5 py-1 transition-colors ${
              active
                ? 'text-white'
                : isDark
                  ? 'text-white/60'
                  : 'text-slate-500'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${variant}`}
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {opt.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
