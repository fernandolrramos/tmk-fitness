import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useBooking } from '@/context/BookingContext'
import { toFeedItem } from '@/lib/mappers'
import { challenge, badgeDefs, type BadgeMetric } from '@/data/social'
import type { ActivityEvent, Badge, StreakInfo } from '@/types'

/** An activity event enriched with the viewer's cheer state. */
export interface FeedItem extends ActivityEvent {
  cheeredByMe: boolean
}

/** Mon…Sun activity for the current week, derived from checked-in sessions. */
function weekActivity(attendedDates: string[]): boolean[] {
  const week = Array<boolean>(7).fill(false)
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const nextMon = new Date(monday)
  nextMon.setDate(monday.getDate() + 7)
  for (const iso of attendedDates) {
    const d = new Date(iso)
    if (d >= monday && d < nextMon) week[(d.getDay() + 6) % 7] = true
  }
  return week
}

interface EngagementValue {
  ready: boolean
  feed: FeedItem[]
  cheer: (id: string) => void

  challengeJoined: boolean
  joinChallenge: () => void
  yourContribution: number
  challengeCurrent: number
  challengeParticipants: number

  /** Live weekly streak (current/best from members, week dots from check-ins). */
  streak: StreakInfo
  /** Achievement badges with earned/progress computed from real data. */
  badges: Badge[]
}

const EngagementContext = createContext<EngagementValue | null>(null)

const CHALLENGE_ID = challenge.id

export function EngagementProvider({ children }: { children: ReactNode }) {
  const { isAuthed, member } = useAuth()
  const { attended } = useBooking()
  const memberId = member.id
  const [ready, setReady] = useState(false)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [challengeJoined, setChallengeJoined] = useState(false)
  const [participantCount, setParticipantCount] = useState(challenge.participantIds.length)

  useEffect(() => {
    if (!isAuthed) return
    let active = true
    ;(async () => {
      const [feedR, partR] = await Promise.all([
        supabase.from('activity_feed_view').select('*').order('minutes_ago', { ascending: true }),
        supabase.from('challenge_participants').select('member_id').eq('challenge_id', CHALLENGE_ID),
      ])
      if (!active) return
      setFeed((feedR.data ?? []).map(toFeedItem))
      const ids = new Set((partR.data ?? []).map((p) => p.member_id))
      setParticipantCount(ids.size)
      setChallengeJoined(memberId ? ids.has(memberId) : false)
      setReady(true)
    })()
    return () => {
      active = false
    }
  }, [isAuthed, memberId])

  const cheer = useCallback(
    (id: string) => {
      const item = feed.find((f) => f.id === id)
      if (!item || !memberId) return
      const wasCheered = item.cheeredByMe
      setFeed((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, cheeredByMe: !wasCheered, cheers: f.cheers + (wasCheered ? -1 : 1) }
            : f,
        ),
      )
      const q = wasCheered
        ? supabase.from('activity_cheers').delete().eq('activity_id', id).eq('member_id', memberId)
        : supabase.from('activity_cheers').upsert({ activity_id: id, member_id: memberId })
      void q.then(({ error }) => error && console.error('cheer', error.message))
    },
    [feed, memberId],
  )

  const joinChallenge = useCallback(() => {
    if (!memberId || challengeJoined) return
    setChallengeJoined(true)
    setParticipantCount((c) => c + 1)
    void supabase
      .from('challenge_participants')
      .upsert({ challenge_id: CHALLENGE_ID, member_id: memberId })
      .then(({ error }) => error && console.error('joinChallenge', error.message))
  }, [memberId, challengeJoined])

  const yourContribution = member.sessionsThisMonth

  const streak = useMemo<StreakInfo>(
    () => ({
      current: member.streakCurrent,
      best: member.streakBest,
      week: weekActivity(attended.map((s) => s.date)),
    }),
    [member.streakCurrent, member.streakBest, attended],
  )

  const badges = useMemo<Badge[]>(() => {
    const sessions = member.sessionsThisMonth
    const morning = attended.filter((s) => s.start < '12:00').length
    const spin = attended.filter((s) => s.classId === 'spinning').length
    const cheersGiven = feed.filter((f) => f.cheeredByMe).length
    const valueFor = (m: BadgeMetric): number => {
      switch (m) {
        case 'firstSession':
        case 'sessions':
          return sessions
        case 'streak':
          return member.streakCurrent
        case 'morning':
          return morning
        case 'spin':
          return spin
        case 'cheers':
          return cheersGiven
      }
    }
    return badgeDefs.map((d) => {
      const v = valueFor(d.metric)
      const earned = v >= d.target
      return {
        id: d.id,
        name: d.name,
        description: d.description,
        icon: d.icon,
        earned,
        progress: earned ? undefined : { value: Math.min(v, d.target), target: d.target },
      }
    })
  }, [member.sessionsThisMonth, member.streakCurrent, attended, feed])

  const value = useMemo<EngagementValue>(
    () => ({
      ready,
      feed,
      cheer,
      challengeJoined,
      joinChallenge,
      yourContribution,
      challengeCurrent: challenge.current + (challengeJoined ? yourContribution : 0),
      challengeParticipants: participantCount,
      streak,
      badges,
    }),
    [
      ready,
      feed,
      cheer,
      challengeJoined,
      joinChallenge,
      yourContribution,
      participantCount,
      streak,
      badges,
    ],
  )

  return (
    <EngagementContext.Provider value={value}>{children}</EngagementContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEngagement(): EngagementValue {
  const ctx = useContext(EngagementContext)
  if (!ctx) throw new Error('useEngagement must be used within an EngagementProvider')
  return ctx
}
