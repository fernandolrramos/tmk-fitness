import { useLanguage } from '@/context/LanguageContext'
import type { MemberStatus } from '@/types'

const STYLES: Record<MemberStatus, string> = {
  active: 'bg-accent-teal/15 text-primary',
  frozen: 'bg-slate-200 text-slate-500',
  expired: 'bg-accent-pink/15 text-accent-pink',
}

/** Coloured membership-status pill. */
export function StatusBadge({ status }: { status: MemberStatus }) {
  const { t } = useLanguage()
  const key = `status.${status}` as const
  return <span className={`tmk-chip ${STYLES[status]}`}>{t(key)}</span>
}
