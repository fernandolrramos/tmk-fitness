import type { Booking, Member } from '@/types'
import { sessionById } from './timetable'
import { nextOccurrence } from '@/lib/dates'

/** Fictional demo member so the UI is personalised out of the box. */
export const seedMember: Member = {
  id: 'm-sara',
  firstName: 'Sara',
  lastName: 'Vikingstad',
  email: 'sara.vikingstad@example.no',
  phone: '912 34 567',
  dialCode: '+47',
  planId: 'monthly-nobinding',
  sessionsThisMonth: 12,
  sessionsGoal: 16,
}

/**
 * Two upcoming bookings already on Sara's calendar so Home isn't empty on
 * first load. Dates are computed as the next real occurrences of these
 * sessions relative to "now", so the countdown is always live.
 */
export function seedBookings(from = new Date()): Booking[] {
  // Two near-future classes so Home/My-classes read naturally on first load.
  const ids = ['s-wed-spin-am', 's-thu-senior']
  return ids
    .map((id) => {
      const session = sessionById(id)
      if (!session) return null
      return { sessionId: id, date: nextOccurrence(session, from).toISOString() }
    })
    .filter((b): b is Booking => b !== null)
}
