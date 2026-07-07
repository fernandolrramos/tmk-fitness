import type { Session } from '@/types'

/**
 * Weekly recurring timetable (weekday: 0 = Monday … 6 = Sunday). Hydrated from
 * Supabase at startup and mutated in place, so lib/dates helpers and pages that
 * read `timetable` / `sessionById` keep working synchronously.
 */
export const timetable: Session[] = []

export function setTimetable(next: Session[]): void {
  timetable.length = 0
  timetable.push(...next)
}

export const sessionById = (id: string): Session | undefined =>
  timetable.find((s) => s.id === id)
