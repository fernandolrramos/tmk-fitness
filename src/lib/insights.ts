import { plans } from '@/data/plans'
import { timetable } from '@/data/timetable'
import type { MemberRecord } from '@/types'

/** Monthly-equivalent value of each plan, in NOK (for revenue estimates). */
export const PLAN_MONTHLY: Record<string, number> = {
  'monthly-binding': 509,
  'monthly-nobinding': 609,
  halfyear: Math.round(3499 / 6),
  yearly: Math.round(6108 / 12),
}

export function activeMembers(members: MemberRecord[]): MemberRecord[] {
  return members.filter((m) => m.status === 'active')
}

/**
 * Members per plan, counting ACTIVE members only — the same population as
 * monthlyRevenue(), so the per-plan revenue breakdown always sums to the
 * top-line total. (Frozen/expired members aren't paying and are excluded.)
 */
export function membersByPlan(members: MemberRecord[]) {
  return plans.map((plan) => ({
    plan,
    count: members.filter((m) => m.planId === plan.id && m.status === 'active').length,
  }))
}

/** Estimated recurring monthly revenue from active members. */
export function monthlyRevenue(members: MemberRecord[]): number {
  return activeMembers(members).reduce(
    (sum, m) => sum + (PLAN_MONTHLY[m.planId] ?? 0),
    0,
  )
}

/** Average fill rate across the weekly timetable (0–1). */
export function fillRate(): number {
  const rates = timetable
    .filter((s) => s.capacity > 1) // exclude 1:1 PT/treatment slots
    .map((s) => (s.capacity - s.spotsLeft) / s.capacity)
  if (!rates.length) return 0
  return rates.reduce((a, b) => a + b, 0) / rates.length
}

export function formatNOK(value: number, lang: 'no' | 'en'): string {
  const formatted = new Intl.NumberFormat(lang === 'no' ? 'nb-NO' : 'en-GB').format(
    value,
  )
  return lang === 'no' ? `${formatted},- kr` : `${formatted} NOK`
}
