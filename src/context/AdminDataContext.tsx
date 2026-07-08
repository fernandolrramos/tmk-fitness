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
import { setClasses } from '@/data/classes'
import { setPlans } from '@/data/plans'
import { setTreatments, setTreatmentSlots } from '@/data/treatments'
import { setTimetable } from '@/data/timetable'
import { setTrainers } from '@/data/trainers'
import { setMemberRecords } from '@/data/members'
import {
  toAdminBooking,
  toClass,
  toMemberRecord,
  toPlan,
  toSession,
  toTrainer,
  toTreatment,
  toTreatmentSlot,
  memberRecordToRow,
  sessionToRow,
  trainerToRow,
} from '@/lib/mappers'
import type { AdminBooking, MemberRecord, Session, Trainer } from '@/types'

/**
 * Admin-side store AND app-wide reference-data bootstrap. When a user signs in
 * it loads the whole catalogue (plans/classes/trainers/sessions/treatments)
 * plus members and bookings from Supabase, fills the synchronous module caches
 * (so lib/dates, lib/social and pages keep working unchanged), and exposes
 * `ready` so the app can gate rendering. Admin edits write through to Supabase.
 */
interface AdminDataValue {
  ready: boolean
  members: MemberRecord[]
  upsertMember: (m: MemberRecord) => void
  deleteMember: (id: string) => void

  sessions: Session[]
  upsertSession: (s: Session) => void
  deleteSession: (id: string) => void

  trainers: Trainer[]
  upsertTrainer: (t: Trainer) => void
  deleteTrainer: (id: string) => void

  bookings: AdminBooking[]
  toggleCheckIn: (bookingId: string) => void
}

const AdminDataContext = createContext<AdminDataValue | null>(null)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth()
  const [ready, setReady] = useState(false)
  const [members, setMembersState] = useState<MemberRecord[]>([])
  const [sessions, setSessionsState] = useState<Session[]>([])
  const [trainers, setTrainersState] = useState<Trainer[]>([])
  const [bookings, setBookingsState] = useState<AdminBooking[]>([])

  useEffect(() => {
    if (!isAuthed) {
      setReady(false)
      return
    }
    let active = true
    ;(async () => {
      const [plansR, classesR, trainersR, sessionsR, treatmentsR, slotsR, membersR, bookingsR] =
        await Promise.all([
          supabase.from('plans').select('*'),
          supabase.from('classes').select('*'),
          supabase.from('trainers').select('*'),
          supabase.from('sessions').select('*'),
          supabase.from('treatments').select('*'),
          supabase.from('treatment_slots').select('*'),
          supabase.from('members').select('*'),
          supabase.from('bookings').select('*'),
        ])
      if (!active) return

      const memberRecords = (membersR.data ?? []).map(toMemberRecord)
      const sessionList = (sessionsR.data ?? []).map(toSession)
      const trainerList = (trainersR.data ?? []).map(toTrainer)
      const bookingList = (bookingsR.data ?? []).map(toAdminBooking)

      // Fill synchronous module caches BEFORE flipping ready so pages that read
      // them (classById, sessionById, timetable, memberRecords, …) are populated.
      setPlans((plansR.data ?? []).map(toPlan))
      setClasses((classesR.data ?? []).map(toClass))
      setTreatments((treatmentsR.data ?? []).map(toTreatment))
      setTreatmentSlots((slotsR.data ?? []).map(toTreatmentSlot))
      setTimetable(sessionList)
      setTrainers(trainerList)
      setMemberRecords(memberRecords)

      setMembersState(memberRecords)
      setSessionsState(sessionList)
      setTrainersState(trainerList)
      setBookingsState(bookingList)
      setReady(true)
    })()
    return () => {
      active = false
    }
  }, [isAuthed])

  const upsertMember = useCallback((m: MemberRecord) => {
    setMembersState((prev) => {
      const i = prev.findIndex((x) => x.id === m.id)
      const next = i === -1 ? [m, ...prev] : prev.map((x) => (x.id === m.id ? m : x))
      setMemberRecords(next)
      return next
    })
    void supabase
      .from('members')
      .upsert(memberRecordToRow(m))
      .then(({ error }) => error && console.error('upsertMember', error.message))
  }, [])

  const deleteMember = useCallback((id: string) => {
    setMembersState((prev) => {
      const next = prev.filter((m) => m.id !== id)
      setMemberRecords(next)
      return next
    })
    void supabase
      .from('members')
      .delete()
      .eq('id', id)
      .then(({ error }) => error && console.error('deleteMember', error.message))
  }, [])

  const upsertSession = useCallback((s: Session) => {
    setSessionsState((prev) => {
      const i = prev.findIndex((x) => x.id === s.id)
      const next = i === -1 ? [...prev, s] : prev.map((x) => (x.id === s.id ? s : x))
      setTimetable(next)
      return next
    })
    void supabase
      .from('sessions')
      .upsert(sessionToRow(s))
      .then(({ error }) => error && console.error('upsertSession', error.message))
  }, [])

  const deleteSession = useCallback((id: string) => {
    setSessionsState((prev) => {
      const next = prev.filter((s) => s.id !== id)
      setTimetable(next)
      return next
    })
    void supabase
      .from('sessions')
      .delete()
      .eq('id', id)
      .then(({ error }) => error && console.error('deleteSession', error.message))
  }, [])

  const upsertTrainer = useCallback((t: Trainer) => {
    setTrainersState((prev) => {
      const i = prev.findIndex((x) => x.id === t.id)
      const next = i === -1 ? [...prev, t] : prev.map((x) => (x.id === t.id ? t : x))
      setTrainers(next)
      return next
    })
    void supabase
      .from('trainers')
      .upsert(trainerToRow(t))
      .then(({ error }) => error && console.error('upsertTrainer', error.message))
  }, [])

  const deleteTrainer = useCallback((id: string) => {
    setTrainersState((prev) => {
      const next = prev.filter((t) => t.id !== id)
      setTrainers(next)
      return next
    })
    void supabase
      .from('trainers')
      .delete()
      .eq('id', id)
      .then(({ error }) => error && console.error('deleteTrainer', error.message))
  }, [])

  const toggleCheckIn = useCallback(
    (bookingId: string) => {
      const current = bookings.find((b) => b.id === bookingId)
      if (!current) return
      const nextVal = !current.checkedIn
      setBookingsState((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, checkedIn: nextVal } : b)),
      )
      // Mirror the trigger's stat change locally so KPIs/leaderboard move live.
      const delta = nextVal ? 1 : -1
      setMembersState((prev) => {
        const next = prev.map((m) =>
          m.id === current.memberId
            ? { ...m, sessionsThisMonth: Math.max(0, m.sessionsThisMonth + delta) }
            : m,
        )
        setMemberRecords(next)
        return next
      })
      void supabase
        .from('bookings')
        .update({ checked_in: nextVal })
        .eq('id', bookingId)
        .then(({ error }) => error && console.error('toggleCheckIn', error.message))
    },
    [bookings],
  )

  const value = useMemo<AdminDataValue>(
    () => ({
      ready,
      members,
      upsertMember,
      deleteMember,
      sessions,
      upsertSession,
      deleteSession,
      trainers,
      upsertTrainer,
      deleteTrainer,
      bookings,
      toggleCheckIn,
    }),
    [
      ready,
      members,
      upsertMember,
      deleteMember,
      sessions,
      upsertSession,
      deleteSession,
      trainers,
      upsertTrainer,
      deleteTrainer,
      bookings,
      toggleCheckIn,
    ],
  )

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData must be used within an AdminDataProvider')
  return ctx
}
