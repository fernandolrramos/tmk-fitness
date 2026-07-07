import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { Role } from '@/types'
import type { ReactNode } from 'react'

/**
 * Route guard. Redirects to /login when signed out, and bounces a user who
 * doesn't match the required role to their own home.
 */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { isAuthed, role: current } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />
  if (current !== role) return <Navigate to={current === 'admin' ? '/admin' : '/'} replace />
  return <>{children}</>
}
