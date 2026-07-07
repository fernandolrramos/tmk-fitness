import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { useLanguage } from '@/context/LanguageContext'

/** Dismissible "add to home screen" hint. Only shows if installable. */
export function InstallChip() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)

  const show = canInstall && !dismissed

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mx-4 mt-3 flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary-dark"
        >
          <Download className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="flex-1 font-medium">{t('install.hint')}</span>
          <button
            type="button"
            onClick={promptInstall}
            className="rounded-lg bg-primary px-3 py-1 text-xs font-heading font-semibold uppercase text-white"
          >
            {t('install.action')}
          </button>
          <button
            type="button"
            aria-label={t('install.dismiss')}
            onClick={() => setDismissed(true)}
            className="text-primary/60 hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
