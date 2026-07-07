import type { ReactNode } from 'react'

/** Labelled form field wrapper used across profile & admin forms. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  )
}

/** Shared input styling. */
export const inputClass =
  'w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary'
