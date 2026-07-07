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
import { toBooking } from '@/lib/mappers'
import { sessionById } from '@/data/timetable'
import type { Booking, DatedSession } from '@/types'

interface BookingContextValue {
  ready: boolean
  bookings: Booking[]
  /** All future booked sessions, materialised & sorted soonest-first. */
  upcoming: DatedSession[]
  /** The soonest upcoming booked session, or null. */
  next: DatedSession | null
  isBooked: (sessionId: string, date: string) => boolean
  book: (session: DatedSession) => void
  cancel: (sessionId: string, date: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const { member } = useAuth()
  const { ready: refReady } = useAdminData()
  const memberId = member.id
  const [bookings, setBookings] = useState<Booking[]>([])
  const [ready, setReady] = useState(false)

  const refetch = useCallback(async () => {
    if (!memberId) {
      setBookings([])
      return
    }
    const { data } = await supabase.from('bookings').select('*').eq('member_id', memberId)
    setBookings((data ?? []).map(toBooking))
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
        () => void refetch(),
      )
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [refReady, memberId, refetch])

  const isBooked = useCallback(
    (sessionId: string, date: string) =>
      bookings.some((b) => b.sessionId === sessionId && b.date === date),
    [bookings],
  )

  const book = useCallback(
    (session: DatedSession) => {
      if (!memberId) return
      setBookings((prev) =>
        prev.some((b) => b.sessionId === session.id && b.date === session.date)
          ? prev
          : [...prev, { sessionId: session.id, date: session.date }],
      )
      const id = `${memberId}-${session.id}-${new Date(session.date).getTime()}`
      void supabase
        .from('bookings')
        .upsert(
          {
            id,
            member_id: memberId,
            session_id: session.id,
            date: session.date,
            checked_in: false,
          },
          { onConflict: 'member_id,session_id,date' },
        )
        .then(({ error }) => error && console.error('book', error.message))
    },
    [memberId],
  )

  const cancel = useCallback(
    (sessionId: string, date: string) => {
      setBookings((prev) => prev.filter((b) => !(b.sessionId === sessionId && b.date === date)))
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

  const upcoming = useMemo<DatedSession[]>(() => {
    const now = Date.now()
    return bookings
      .map((b) => {
        const session = sessionById(b.sessionId)
        if (!session) return null
        return { ...session, date: b.date } as DatedSession
      })
      .filter((s): s is DatedSession => s !== null)
      .filter((s) => new Date(s.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [bookings])

  const value = useMemo<BookingContextValue>(
    () => ({
      ready,
      bookings,
      upcoming,
      next: upcoming[0] ?? null,
      isBooked,
      book,
      cancel,
    }),
    [ready, bookings, upcoming, isBooked, book, cancel],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider')
  return ctx
}
