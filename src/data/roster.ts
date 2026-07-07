import type { AdminBooking } from '@/types'
import { memberRecords } from './members'
import { sessionsForDate } from '@/lib/dates'

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/**
 * Deterministically materialise who is booked into each session over the next
 * 7 days, derived from each session's spots-left so the numbers stay
 * consistent with the member-facing schedule.
 */
export function seedAdminBookings(from = new Date()): AdminBooking[] {
  const out: AdminBooking[] = []
  const active = memberRecords.filter((m) => m.status === 'active')
  for (let d = 0; d < 7; d++) {
    const day = new Date(from)
    day.setDate(from.getDate() + d)
    for (const s of sessionsForDate(day)) {
      const booked = Math.max(0, s.capacity - s.spotsLeft)
      const h = hash(s.id + d)
      const count = Math.min(booked, active.length)
      for (let i = 0; i < count; i++) {
        const m = active[(h + i * 7) % active.length]
        out.push({
          id: `${s.id}-${d}-${m.id}`,
          memberId: m.id,
          sessionId: s.id,
          date: s.date,
          checkedIn: d === 0 && i % 2 === 0,
        })
      }
    }
  }
  return out
}
