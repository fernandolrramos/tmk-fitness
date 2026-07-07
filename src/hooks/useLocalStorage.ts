import { useCallback, useEffect, useState } from 'react'

/**
 * useState mirrored to localStorage. Reads once on mount (falling back to the
 * provided initial value) and writes on every change. Safe if storage is
 * unavailable (private mode / SSR).
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore write failures (private mode, quota) */
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initial), [initial])

  return [value, setValue, reset] as const
}
