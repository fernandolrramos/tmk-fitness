import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useAdminData } from '@/context/AdminDataContext'
import { useBooking } from '@/context/BookingContext'
import { useEngagement } from '@/context/EngagementContext'
import { useMessages } from '@/context/MessagesContext'

const logo = '/brand/logo.png'

/**
 * Holds a branded splash until Supabase auth has resolved and — when signed in —
 * every data context has hydrated from the database. This lets the rest of the
 * app keep reading its contexts and the synchronous data caches synchronously.
 */
export function HydrationGate({ children }: { children: ReactNode }) {
  const { authReady, isAuthed } = useAuth()
  const admin = useAdminData()
  const booking = useBooking()
  const engagement = useEngagement()
  const messages = useMessages()

  const dataReady =
    !isAuthed || (admin.ready && booking.ready && engagement.ready && messages.ready)

  if (authReady && dataReady) return <>{children}</>

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-secondary safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white px-6 py-5 shadow-card"
      >
        <img src={logo} alt="TMK Fitness" className="h-12 w-auto" />
      </motion.div>
      <motion.div
        aria-label="Loading"
        className="h-8 w-8 rounded-full border-2 border-white/25 border-t-accent-teal"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
    </div>
  )
}
