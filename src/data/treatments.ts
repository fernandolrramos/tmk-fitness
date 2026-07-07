import type { Treatment, TreatmentSlot } from '@/types'

/** 1:1 treatment & PT offerings. Hydrated from Supabase at startup. */
export const treatments: Treatment[] = []
export const treatmentSlots: TreatmentSlot[] = []

export function setTreatments(next: Treatment[]): void {
  treatments.length = 0
  treatments.push(...next)
}

export function setTreatmentSlots(next: TreatmentSlot[]): void {
  treatmentSlots.length = 0
  treatmentSlots.push(...next)
}

export const treatmentById = (id: string): Treatment =>
  treatments.find((t) => t.id === id) ?? treatments[0]
