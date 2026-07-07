import type { MemberRecord } from '@/types'

/**
 * Member CRM list. Hydrated from Supabase at startup and mutated in place so
 * lib/social (leaderboard, buddiesGoing) and Community's member lookups keep
 * reading it synchronously. AdminDataContext keeps this cache in sync on edits.
 */
export const memberRecords: MemberRecord[] = []

export function setMemberRecords(next: MemberRecord[]): void {
  memberRecords.length = 0
  memberRecords.push(...next)
}
