import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Check, Copy, ExternalLink, Flame, Gift, Share2, UserPlus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { plans, planById } from '@/data/plans'
import { streak, referralCode } from '@/data/social'
import { LanguageToggle } from '@/components/LanguageToggle'
import { DialCodePicker } from '@/components/DialCodePicker'
import { ProgressRing } from '@/components/ProgressRing'
import { BadgeGrid } from '@/components/BadgeGrid'
import { ShareSheet } from '@/components/ShareSheet'
import { readAndResizeImage } from '@/lib/image'
import type { Member } from '@/types'

/** TMK's real online enrolment / membership-change page. */
const ENROLL_URL = 'https://tmkfitness.ibooking.no/nettinnmelding'

export function Profile() {
  const { t, tc, lang } = useLanguage()
  const { member, updateMember, logout } = useAuth()
  const navigate = useNavigate()

  const [draft, setDraft] = useState<Member>(member)
  const [saved, setSaved] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Keep the draft in sync if the underlying member changes elsewhere.
  useEffect(() => setDraft(member), [member])

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await readAndResizeImage(file)
      // Persist immediately so the photo survives even without "Save".
      updateMember({ photo: dataUrl })
    } catch {
      /* ignore unreadable images */
    }
    e.target.value = ''
  }

  const shareText =
    lang === 'no'
      ? `Jeg har fullført ${member.sessionsThisMonth} økter denne måneden hos TMK Fitness!`
      : `I've done ${member.sessionsThisMonth} sessions this month at TMK Fitness!`

  const dirty =
    draft.firstName !== member.firstName ||
    draft.lastName !== member.lastName ||
    draft.phone !== member.phone ||
    draft.dialCode !== member.dialCode ||
    draft.planId !== member.planId

  const set = (patch: Partial<Member>) => setDraft((d) => ({ ...d, ...patch }))

  const handleSave = () => {
    updateMember(draft)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const plan = planById(member.planId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 px-4 py-5"
    >
      {/* Avatar + name */}
      <section className="flex flex-col items-center pt-2">
        <div className="relative">
          {member.photo ? (
            <img
              src={member.photo}
              alt={`${draft.firstName} ${draft.lastName}`}
              className="h-24 w-24 rounded-full object-cover shadow-card"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-teal font-heading text-3xl font-bold uppercase text-white shadow-card">
              {(draft.firstName[0] ?? '') + (draft.lastName[0] ?? '')}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label={t('profile.changePhoto')}
            title={t('profile.changePhoto')}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
        </div>
        <h2 className="mt-3 font-heading text-2xl font-bold uppercase text-secondary">
          {draft.firstName} {draft.lastName}
        </h2>
        <span className="tmk-chip mt-1 bg-primary/10 text-primary">
          {t('profile.member')}
        </span>
      </section>

      {/* Goals ring + streak */}
      <section className="tmk-card flex items-center gap-5 p-5">
        <ProgressRing value={member.sessionsThisMonth} max={member.sessionsGoal} />
        <div>
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t('profile.goals')}
          </p>
          <p className="mt-1 font-heading text-2xl font-bold text-secondary">
            {member.sessionsThisMonth} {t('profile.sessionsOf')} {member.sessionsGoal}
          </p>
          <p className="text-sm text-slate-500">
            {t('profile.sessions')} {t('profile.thisMonth')}
          </p>
          <span className="tmk-chip mt-2 bg-accent-pink/10 text-accent-pink">
            <Flame className="h-3.5 w-3.5 fill-current" />
            {streak.current} {t(streak.current === 1 ? 'streak.week' : 'streak.weeks')}
          </span>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('badges.title')}
        </h3>
        <BadgeGrid />
      </section>

      {/* Share progress */}
      <button
        type="button"
        onClick={() => setShareOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-heading font-semibold uppercase tracking-wide text-secondary"
      >
        <Share2 className="h-4 w-4" />
        {t('profile.share')}
      </button>

      {/* Referral */}
      <ReferralCard />

      {/* Personal info */}
      <section className="space-y-3">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('profile.personalInfo')}
        </h3>

        <Field label={t('profile.firstName')}>
          <input
            value={draft.firstName}
            onChange={(e) => set({ firstName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
          />
        </Field>

        <Field label={t('profile.lastName')}>
          <input
            value={draft.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
          />
        </Field>

        <Field label={t('profile.phone')}>
          <div className="flex">
            <DialCodePicker
              value={draft.dialCode}
              onChange={(dialCode) => set({ dialCode })}
            />
            <input
              inputMode="tel"
              value={draft.phone}
              onChange={(e) => set({ phone: e.target.value })}
              className="w-full rounded-r-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </Field>
      </section>

      {/* Membership plan picker */}
      <section className="space-y-2">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('profile.plan')}
        </h3>
        <div className="tmk-card p-4">
          <p className="font-heading text-lg font-bold uppercase text-secondary">
            {tc(plan.name)}
          </p>
          <p className="text-primary">{tc(plan.price)}</p>
          <p className="text-sm text-slate-500">{tc(plan.terms)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {plans.map((p) => (
            <a
              key={p.id}
              href={ENROLL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                member.planId === p.id
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 bg-white hover:border-primary/40'
              }`}
            >
              <span className="flex items-center gap-1 font-heading font-semibold uppercase text-secondary">
                {tc(p.name)}
                <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">{tc(p.price)}</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-400">{t('profile.planExternalHint')}</p>
      </section>

      {/* Language */}
      <section className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t('profile.language')}
        </h3>
        <LanguageToggle variant="light" />
      </section>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty}
        className="w-full rounded-2xl bg-primary py-4 font-heading text-lg font-bold uppercase tracking-wide text-white transition-opacity disabled:opacity-40"
      >
        {t('profile.save')}
      </button>

      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className="w-full rounded-2xl border border-slate-200 py-3.5 font-heading font-semibold uppercase tracking-wide text-slate-500"
      >
        {t('admin.logout')}
      </button>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-center text-sm text-white shadow-sheet"
          >
            <Check className="h-4 w-4 text-accent-teal" />
            {t('profile.saved')}
          </motion.div>
        )}
      </AnimatePresence>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} text={shareText} />
    </motion.div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  )
}

function ReferralCard() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    try {
      navigator.clipboard?.writeText(referralCode)
    } catch {
      /* clipboard may be unavailable */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-primary p-5 text-white shadow-card">
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide">
          {t('referral.title')}
        </h3>
      </div>
      <p className="mt-1 text-sm text-white/80">{t('referral.body')}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 rounded-xl border border-dashed border-white/40 bg-white/10 px-4 py-3 text-center font-heading text-lg font-bold tracking-[0.2em]">
          {referralCode}
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-3 font-heading text-sm font-semibold uppercase tracking-wide text-primary"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t('referral.copied') : t('referral.copy')}
        </button>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
        <Gift className="h-3.5 w-3.5" />
        {t('referral.reward')}
      </p>
    </section>
  )
}
