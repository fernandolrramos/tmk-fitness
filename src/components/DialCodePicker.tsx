import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { dialCodes, dialCodeByCode } from '@/data/dialCodes'
import { useLanguage } from '@/context/LanguageContext'

/** Searchable international dial-code picker (default +47 Norway). */
export function DialCodePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (code: string) => void
}) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = dialCodeByCode(value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return dialCodes
    return dialCodes.filter(
      (d) =>
        d.country.toLowerCase().includes(q) ||
        d.code.includes(q) ||
        d.iso.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-1.5 rounded-l-xl border-y border-l border-slate-200 bg-slate-50 px-3 py-3 font-medium text-secondary"
      >
        <span aria-hidden>{selected.flag}</span>
        <span className="tabular-nums">{selected.code}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="relative flex max-h-[70vh] w-full max-w-lg flex-col rounded-t-3xl bg-white p-4 shadow-sheet safe-bottom safe-x"
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('profile.searchCountry')}
                className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-primary"
              />
              <ul className="no-scrollbar flex-1 overflow-y-auto">
                {filtered.map((d) => (
                  <li key={d.code + d.iso}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(d.code)
                        setOpen(false)
                        setQuery('')
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${
                        d.code === value ? 'bg-primary/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl" aria-hidden>
                        {d.flag}
                      </span>
                      <span className="flex-1 text-sm text-secondary">{d.country}</span>
                      <span className="tabular-nums text-sm font-medium text-slate-500">
                        {d.code}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
