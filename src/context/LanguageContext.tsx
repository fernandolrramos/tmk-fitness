import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { translations, type TranslationKey } from '@/i18n/translations'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Lang, Localized } from '@/types'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  /** Translate a UI key. */
  t: (key: TranslationKey) => string
  /** Resolve a bilingual seed-content value. */
  tc: (value: Localized) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'tmk-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>(STORAGE_KEY, 'no')

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? key,
    [lang],
  )
  const tc = useCallback((value: Localized) => value[lang], [lang])
  const toggle = useCallback(
    () => setLang(lang === 'no' ? 'en' : 'no'),
    [lang, setLang],
  )

  const value = useMemo(
    () => ({ lang, setLang, toggle, t, tc }),
    [lang, setLang, toggle, t, tc],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
