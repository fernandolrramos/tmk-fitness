import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Wrench, type LucideIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { LanguageToggle } from '@/components/LanguageToggle'
import { Field, inputClass } from '@/components/ui/Field'
import type { Role } from '@/types'

const logo = '/brand/logo.png'

/** Demo account emails, prefilled by the role picker for a one-tap sign-in. */
const DEMO_EMAIL: Record<Role, string> = {
  member: 'sara.vikingstad@example.no',
  admin: 'admin@tmkfitness.no',
}
const DEMO_PASSWORD = 'demo1234'

export function Login() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('member')
  const [email, setEmail] = useState(DEMO_EMAIL.member)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError(false)
    setSubmitting(true)
    try {
      const resolvedRole = await login(email.trim(), password)
      navigate(resolvedRole === 'admin' ? '/admin' : '/')
    } catch {
      setError(true)
      setSubmitting(false)
    }
  }

  const roles: { id: Role; label: string; desc: string; icon: LucideIcon }[] = [
    { id: 'member', label: t('login.member'), desc: t('login.memberDesc'), icon: Dumbbell },
    { id: 'admin', label: t('login.admin'), desc: t('login.adminDesc'), icon: Wrench },
  ]

  return (
    <div className="relative flex min-h-full flex-col bg-secondary text-white safe-top safe-bottom">
      <div className="absolute right-4 top-4 safe-top">
        <LanguageToggle variant="dark" />
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="rounded-2xl bg-white px-5 py-4 shadow-card">
              <img src={logo} alt="TMK Fitness" className="h-12 w-auto" />
            </div>
            <h1 className="mt-6 font-heading text-3xl font-bold uppercase tracking-tight">
              {t('login.welcome')}
            </h1>
            <p className="mt-1 text-sm text-white/60">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* Role selector — prefills the matching demo account. */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">
                {t('login.role')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id)
                      setEmail(DEMO_EMAIL[r.id])
                      setPassword(DEMO_PASSWORD)
                      setError(false)
                    }}
                    className={`rounded-2xl border p-3 text-left transition-colors ${
                      role === r.id
                        ? 'border-accent-teal bg-white/10'
                        : 'border-white/15 bg-white/5'
                    }`}
                  >
                    <r.icon className="h-7 w-7 text-accent-teal" />
                    <p className="mt-2 font-heading font-semibold uppercase tracking-wide">
                      {r.label}
                    </p>
                    <p className="text-[11px] leading-tight text-white/55">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 [&_span]:text-white/50">
              <Field label={t('login.email')}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} border-white/15 bg-white/10 text-white placeholder:text-white/40`}
                />
              </Field>
              <div className="mt-3">
                <Field label={t('login.password')}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} border-white/15 bg-white/10 text-white placeholder:text-white/40`}
                  />
                </Field>
              </div>
            </div>

            {error && (
              <p className="text-center text-sm text-accent-pink">{t('login.error')}</p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent-teal py-4 font-heading text-lg font-bold uppercase tracking-wide text-white shadow-card disabled:opacity-70"
            >
              {submitting ? t('login.signingIn') : t('login.signIn')}
            </motion.button>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-[11px] uppercase tracking-wide text-white/40">
                {t('login.demoHint')}
              </p>
              <p className="mt-1 text-xs text-white/70">
                {t('login.member')}: {DEMO_EMAIL.member}
              </p>
              <p className="text-xs text-white/70">
                {t('login.admin')}: {DEMO_EMAIL.admin}
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
