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
import { toMember } from '@/lib/mappers'
import type { Database } from '@/types/supabase'
import type { Member, Role } from '@/types'

type MemberUpdate = Database['public']['Tables']['members']['Update']

/**
 * Real authentication via Supabase Auth. A signed-in user's role and linked
 * member profile come from the `profiles` + `members` tables (never the login
 * UI). `authReady` flips true once the initial session has resolved, so the
 * app can gate rendering behind a splash.
 */
interface AuthContextValue {
  authReady: boolean
  isAuthed: boolean
  role: Role | null
  member: Member
  login: (email: string, password: string) => Promise<Role>
  logout: () => Promise<void>
  updateMember: (patch: Partial<Member>) => void
  /** Re-fetch the member row from the DB (e.g. after a check-in bumps stats). */
  refreshMember: () => void
}

/** Neutral member used before hydration / for admin accounts (no member row). */
const PLACEHOLDER_MEMBER: Member = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dialCode: '+47',
  planId: '',
  sessionsThisMonth: 0,
  sessionsGoal: 0,
  streakCurrent: 0,
  streakBest: 0,
}

const AuthContext = createContext<AuthContextValue | null>(null)

function patchToRow(p: Partial<Member>): MemberUpdate {
  const row: MemberUpdate = {}
  if (p.firstName !== undefined) row.first_name = p.firstName
  if (p.lastName !== undefined) row.last_name = p.lastName
  if (p.email !== undefined) row.email = p.email
  if (p.phone !== undefined) row.phone = p.phone
  if (p.dialCode !== undefined) row.dial_code = p.dialCode
  if (p.planId !== undefined) row.plan_id = p.planId
  if (p.photo !== undefined) row.photo = p.photo
  if (p.sessionsGoal !== undefined) row.sessions_goal = p.sessionsGoal
  return row
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const [member, setMember] = useState<Member>(PLACEHOLDER_MEMBER)

  const loadProfile = useCallback(async (userId: string): Promise<Role | null> => {
    const { data: prof } = await supabase
      .from('profiles')
      .select('role, member_id')
      .eq('id', userId)
      .single()
    if (!prof) {
      setRole(null)
      setMember(PLACEHOLDER_MEMBER)
      return null
    }
    const r = prof.role as Role
    setRole(r)
    if (prof.member_id) {
      const { data: m } = await supabase
        .from('members')
        .select('*')
        .eq('id', prof.member_id)
        .single()
      setMember(m ? toMember(m) : PLACEHOLDER_MEMBER)
    } else {
      setMember(PLACEHOLDER_MEMBER)
    }
    return r
  }, [])

  // Resolve the initial session, then listen for auth changes.
  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) await loadProfile(data.session.user.id)
      if (active) setAuthReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer supabase calls out of the callback to avoid re-entrancy issues.
      setTimeout(() => {
        if (session?.user) {
          void loadProfile(session.user.id)
        } else {
          setRole(null)
          setMember(PLACEHOLDER_MEMBER)
        }
      }, 0)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const login = useCallback(
    async (email: string, password: string): Promise<Role> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.user) throw error ?? new Error('Sign-in failed')
      const r = await loadProfile(data.user.id)
      return r ?? 'member'
    },
    [loadProfile],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setRole(null)
    setMember(PLACEHOLDER_MEMBER)
  }, [])

  const updateMember = useCallback(
    (patch: Partial<Member>) => {
      setMember((m) => ({ ...m, ...patch }))
      const id = member.id
      if (!id) return
      const row = patchToRow(patch)
      if (Object.keys(row).length === 0) return
      void supabase
        .from('members')
        .update(row)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('updateMember failed', error.message)
        })
    },
    [member.id],
  )

  const refreshMember = useCallback(() => {
    const id = member.id
    if (!id) return
    void supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setMember(toMember(data))
      })
  }, [member.id])

  const value = useMemo<AuthContextValue>(
    () => ({
      authReady,
      isAuthed: role !== null,
      role,
      member,
      login,
      logout,
      updateMember,
      refreshMember,
    }),
    [authReady, role, member, login, logout, updateMember, refreshMember],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
