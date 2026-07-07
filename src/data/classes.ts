import type { GymClass } from '@/types'

/**
 * TMK Fitness class catalogue. Hydrated once from Supabase at startup (see
 * AdminDataContext bootstrap); the array is mutated in place so existing
 * synchronous consumers (classById, direct imports) keep working unchanged.
 */
export const classes: GymClass[] = []

export function setClasses(next: GymClass[]): void {
  classes.length = 0
  classes.push(...next)
}

export const classById = (id: string): GymClass =>
  classes.find((c) => c.id === id) ?? classes[0]
