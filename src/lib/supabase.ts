import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * The single Supabase client for the app. URL + publishable (anon) key come
 * from Vite env vars; the key is safe in a client bundle because Row Level
 * Security gates all data access on the server.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  // Surfaced early so a missing env var is obvious in the console.
  // eslint-disable-next-line no-console
  console.error(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (.env)',
  )
}

export const supabase = createClient<Database>(url ?? '', anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
