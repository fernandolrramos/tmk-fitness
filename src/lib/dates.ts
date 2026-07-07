import type { DatedSession, Lang, Session } from '@/types'
import { timetable } from '@/data/timetable'

/** Our timetable weekday (0 = Mon … 6 = Sun) → JS getDay() (0 = Sun … 6 = Sat). */
function toJsDay(weekday: number): number {
  return (weekday + 1) % 7
}

/** BCP-47 locale for the active language. */
export function localeFor(lang: Lang): string {
  return lang === 'no' ? 'nb-NO' : 'en-GB'
}

function parseHM(hm: string): [number, number] {
  const [h, m] = hm.split(':').map(Number)
  return [h, m]
}

/**
 * The next date-time (>= `from`) matching a session's weekday + start time.
 */
export function nextOccurrence(session: Session, from = new Date()): Date {
  const targetDay = toJsDay(session.weekday)
  const [h, m] = parseHM(session.start)
  const d = new Date(from)
  d.setSeconds(0, 0)
  let delta = (targetDay - d.getDay() + 7) % 7
  const candidate = new Date(d)
  candidate.setDate(d.getDate() + delta)
  candidate.setHours(h, m, 0, 0)
  if (candidate.getTime() <= from.getTime()) {
    delta += 7
    candidate.setDate(candidate.getDate() + 7)
  }
  return candidate
}

/** Materialise a session onto a concrete date. */
export function datedSession(session: Session, date: Date): DatedSession {
  const [h, m] = parseHM(session.start)
  const start = new Date(date)
  start.setHours(h, m, 0, 0)
  return { ...session, date: start.toISOString() }
}

/**
 * All sessions for a given calendar date, materialised & sorted by start time.
 */
export function sessionsForDate(date: Date): DatedSession[] {
  const jsDay = date.getDay()
  return timetable
    .filter((s) => toJsDay(s.weekday) === jsDay)
    .map((s) => datedSession(s, date))
    .sort((a, b) => a.start.localeCompare(b.start))
}

/** A rolling window of `count` days starting today. */
export function upcomingDays(count: number, from = new Date()): Date[] {
  const out: Date[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(from)
    d.setDate(from.getDate() + i)
    d.setHours(0, 0, 0, 0)
    out.push(d)
  }
  return out
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// ---- Intl-based formatters ------------------------------------------------

export function formatWeekdayShort(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor(lang), { weekday: 'short' }).format(date)
}

export function formatDayHeader(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function formatDayNumber(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor(lang), { day: 'numeric' }).format(date)
}

export function formatTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeFor(lang), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** "18 min ago" / "for 18 min siden" from a minutes-ago value. */
export function formatAgo(minutesAgo: number, lang: Lang): string {
  const rtf = new Intl.RelativeTimeFormat(localeFor(lang), { numeric: 'auto' })
  if (minutesAgo < 60) return rtf.format(-minutesAgo, 'minute')
  if (minutesAgo < 60 * 24) return rtf.format(-Math.round(minutesAgo / 60), 'hour')
  return rtf.format(-Math.round(minutesAgo / (60 * 24)), 'day')
}

export function formatRelativeDay(date: Date, lang: Lang): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000)
  const rtf = new Intl.RelativeTimeFormat(localeFor(lang), { numeric: 'auto' })
  return rtf.format(days, 'day')
}
