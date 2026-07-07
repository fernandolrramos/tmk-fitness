import type { Trainer } from '@/types'

/**
 * Trainers. Hydrated from Supabase at startup (mutated in place). The admin
 * Trainers console and member-facing pages both read the live list via
 * AdminDataContext; this cache backs the trainerByName helper.
 */
export const trainers: Trainer[] = []

export function setTrainers(next: Trainer[]): void {
  trainers.length = 0
  trainers.push(...next)
}

export const trainerByName = (name: string): Trainer | undefined =>
  trainers.find((t) => t.name.split(' ')[0] === name || t.name === name)
