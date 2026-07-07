import type { MembershipPlan } from '@/types'

/** Membership plans. Hydrated from Supabase at startup (mutated in place). */
export const plans: MembershipPlan[] = []

export function setPlans(next: MembershipPlan[]): void {
  plans.length = 0
  plans.push(...next)
}

export const planById = (id: string): MembershipPlan =>
  plans.find((p) => p.id === id) ?? plans[0]
