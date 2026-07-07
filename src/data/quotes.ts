import type { Localized } from '@/types'

/** Short original gym motivation lines, bilingual, rotated one per day. */
export const quotes: Localized[] = [
  {
    no: 'Den beste økta er den du faktisk møter opp til.',
    en: 'The best workout is the one you actually show up for.',
  },
  {
    no: 'Sterk starter ikke i speilet — den starter i dag.',
    en: 'Strength doesn’t start in the mirror — it starts today.',
  },
  {
    no: 'Ett steg om gangen, én rep om gangen.',
    en: 'One step at a time, one rep at a time.',
  },
  {
    no: 'Du angrer aldri på en økt du fullførte.',
    en: 'You never regret a session you finished.',
  },
  {
    no: 'Framgang slår perfeksjon — hver gang.',
    en: 'Progress beats perfection — every single time.',
  },
  {
    no: 'Kroppen din klarer mer enn hodet ditt tror.',
    en: 'Your body can handle more than your mind believes.',
  },
  {
    no: 'Møt opp for deg selv i dag. Resten følger.',
    en: 'Show up for yourself today. The rest follows.',
  },
]

/** Deterministic day-of-year index so the quote is stable within a day. */
export function quoteOfTheDay(date: Date): Localized {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86_400_000)
  return quotes[dayOfYear % quotes.length]
}
