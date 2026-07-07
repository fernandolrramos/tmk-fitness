import { memberRecords } from '@/data/members'
import { buddyIds } from '@/data/social'
import { sessionsForDate, upcomingDays } from '@/lib/dates'
import type { DatedSession, Member, MemberRecord } from '@/types'

/** The logged-in member rendered as an attendee avatar (photo or gradient). */
export function youAsAttendee(
  member: Pick<Member, 'firstName' | 'lastName' | 'photo'>,
): Pick<MemberRecord, 'firstName' | 'lastName' | 'avatar'> & { photo?: string } {
  return {
    firstName: member.firstName,
    lastName: member.lastName,
    avatar: 'from-primary to-accent-teal',
    photo: member.photo,
  }
}

export interface LeaderboardRow {
  member: MemberRecord
  rank: number
  isYou: boolean
}

/** This-month leaderboard by sessions, with the demo member flagged. */
export function leaderboard(youId = 'm-sara'): LeaderboardRow[] {
  return [...memberRecords]
    .filter((m) => m.status === 'active')
    .sort((a, b) => b.sessionsThisMonth - a.sessionsThisMonth)
    .map((member, i) => ({ member, rank: i + 1, isYou: member.id === youId }))
}

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Deterministic subset of the member's buddies attending a given session. */
export function buddiesGoing(sessionId: string): MemberRecord[] {
  return buddyIds
    .filter((id) => hash(sessionId + id) % 3 === 0)
    .map((id) => memberRecords.find((m) => m.id === id))
    .filter((m): m is MemberRecord => m !== undefined)
}

/**
 * The soonest upcoming group class that at least one buddy is attending —
 * used for the Home social-proof nudge.
 */
export function nextBuddyClass():
  | { session: DatedSession; buddies: MemberRecord[] }
  | null {
  for (const day of upcomingDays(7)) {
    for (const session of sessionsForDate(day)) {
      if (session.capacity <= 1) continue
      if (new Date(session.date).getTime() <= Date.now()) continue
      const buddies = buddiesGoing(session.id)
      if (buddies.length > 0) return { session, buddies }
    }
  }
  return null
}
