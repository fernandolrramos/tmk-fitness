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
import { useAdminData } from '@/context/AdminDataContext'
import { sessionById } from '@/data/timetable'
import { memberRecords, setMemberRecords } from '@/data/members'
import { isSameDay } from '@/lib/dates'
import type { Booking, DatedSession } from '@/types'

/** A member's booking row with attendance state. */
interface Row {
  sessionId: string
  date: string
  checkedIn: boolean
}

interface BookingContextValue {
  ready: boolean
  bookings: Booking[]
  /** Future booked sessions, soonest-first. */
  upcoming: DatedSession[]
  /** The soonest upcoming booked session, or null. */
  next: DatedSession | null
  /** Attended (checked-in) sessions, newest-first — the real "past" list. */
  attended: DatedSession[]
  /** Today's booked sessions that have started and aren't checked in yet. */
  toCheckIn: DatedSession[]
  isBooked: (sessionId: string, date: string) => boolean
  book: (session: DatedSession) => void
  cancel: (sessionId: string, date: string) => void
  /** Mark a booked session attended (member self check-in). */
  checkIn: (sessionId: string, date: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

const materialise = (r: Row): DatedSession | null => {
  const session = sessionById(r.sessionId)
  return session ? ({ ...session, date: r.date } as DatedSession) : null
}
const notNull = (s: DatedSession | null): s is DatedSession => s !== null

export function BookingProvider({ children }: { children: ReactNode }) {
  const { member, refreshMember } = useAuth()
  const { ready: refReady } = useAdminData()
  const memberId = member.id
  const [rows, setRows] = useState<Row[]>([])
  const [ready, setReady] = useState(false)

  const refetch = useCallback(async () => {
    if (!memberId) {
      setRows([])
      return
    }
    const { data } = await supabase.from('bookings').select('*').eq('member_id', memberId)
    setRows(
      (data ?? []).map((b) => ({
        sessionId: b.session_id,
        date: b.date,
        checkedIn: b.checked_in,
      })),
    )
  }, [memberId])

  useEffect(() => {
    if (!refReady) return
    let active = true
    ;(async () => {
      await refetch()
      if (active) setReady(true)
    })()
    const channel = supabase
      .channel(`bookings-${memberId || 'none'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `member_id=eq.${memberId}` },
        () => {
          void refetch()
          refreshMember() // admin/self check-in may have bumped my stats
        },
      )
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [refReady, memberId, refetch, refreshMember])

  const bookings = useMemo<Booking[]>(
    () => rows.map((r) => ({ sessionId: r.sessionId, date: r.date })),
    [rows],
  )

  const isBooked = useCallback(
    (sessionId: string, date: string) =>
      rows.some((r) => r.sessionId === sessionId && r.date === date),
    [rows],
  )

  const book = useCallback(
    (session: DatedSession) => {
      if (!memberId) return
      setRows((prev) =>
        prev.some((r) => r.sessionId === session.id && r.date === session.date)
          ? prev
          : [...prev, { sessionId: session.id, date: session.date, checkedIn: false }],
      )
      const id = `${memberId}-${session.id}-${new Date(session.date).getTime()}`
      void supabase
        .from('bookings')
        .upsert(
          { id, member_id: memberId, session_id: session.id, date: session.date, checked_in: false },
          { onConflict: 'member_id,session_id,date' },
        )
        .then(({ error }) => error && console.error('book', error.message))
    },
    [memberId],
  )

  const cancel = useCallback(
    (sessionId: string, date: string) => {
      setRows((prev) => prev.filter((r) => !(r.sessionId === sessionId && r.date === date)))
      if (!memberId) return
      void supabase
        .from('bookings')
        .delete()
        .eq('member_id', memberId)
        .eq('session_id', sessionId)
        .eq('date', date)
        .then(({ error }) => error && console.error('cancel', error.message))
    },
    [memberId],
  )

  const checkIn = useCallback(
    (sessionId: string, date: string) => {
      if (!memberId) return
      setRows((prev) =>
        prev.map((r) =>
          r.sessionId === sessionId && r.date === date ? { ...r, checkedIn: true } : r,
        ),
      )
      // Keep the leaderboard cache (read by Community) in sync with the ring.
      setMemberRecords(
        memberRecords.map((m) =>
          m.id === memberId ? { ...m, sessionsThisMonth: m.sessionsThisMonth + 1 } : m,
        ),
      )
      void supabase
        .from('bookings')
        .update({ checked_in: true })
        .eq('member_id', memberId)
        .eq('session_id', sessionId)
        .eq('date', date)
        .then(({ error }) => {
          if (error) console.error('checkIn', error.message)
          else refreshMember() // pull trigger-updated sessions_this_month + streak
        })
    },
    [memberId, refreshMember],
  )

  const upcoming = useMemo<DatedSession[]>(() => {
    const now = Date.now()
    return rows
      .map(materialise)
      .filter(notNull)
      .filter((s) => new Date(s.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [rows])

  const attended = useMemo<DatedSession[]>(
    () =>
      rows
        .filter((r) => r.checkedIn)
        .map(materialise)
        .filter(notNull)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [rows],
  )

  const toCheckIn = useMemo<DatedSession[]>(() => {
    const now = Date.now()
    return rows
      .filter((r) => !r.checkedIn && isSameDay(new Date(r.date), new Date()) && new Date(r.date).getTime() <= now)
      .map(materialise)
      .filter(notNull)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [rows])

  const value = useMemo<BookingContextValue>(
    () => ({
      ready,
      bookings,
      upcoming,
      next: upcoming[0] ?? null,
      attended,
      toCheckIn,
      isBooked,
      book,
      cancel,
      checkIn,
    }),
    [ready, bookings, upcoming, attended, toCheckIn, isBooked, book, cancel, checkIn],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider')
  return ctx
}
