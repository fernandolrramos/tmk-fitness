import { useEffect, useState } from 'react'

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function diff(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now())
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

/** Live countdown to an ISO date-time, ticking once per second. */
export function useCountdown(iso: string | null): TimeLeft | null {
  const [left, setLeft] = useState<TimeLeft | null>(() =>
    iso ? diff(new Date(iso).getTime()) : null,
  )

  useEffect(() => {
    if (!iso) {
      setLeft(null)
      return
    }
    const target = new Date(iso).getTime()
    setLeft(diff(target))
    const id = window.setInterval(() => setLeft(diff(target)), 1000)
    return () => window.clearInterval(id)
  }, [iso])

  return left
}
