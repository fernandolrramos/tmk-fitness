import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
// Provided by vite-plugin-pwa at build/dev time.
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useLanguage } from '@/context/LanguageContext'

/**
 * Surfaces a toast when a new service worker is waiting ("update available")
 * and a subtle "offline ready" confirmation on first install.
 */
export function UpdateToast() {
  const { t } = useLanguage()
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <AnimatePresence>
      {(needRefresh || offlineReady) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-2xl bg-secondary px-4 py-3 text-white shadow-sheet safe-x"
        >
          {needRefresh ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-heading text-sm font-semibold uppercase tracking-wide">
                  {t('update.title')}
                </p>
                <p className="text-xs text-white/70">{t('update.body')}</p>
              </div>
              <button
                type="button"
                onClick={() => updateServiceWorker(true)}
                className="rounded-lg bg-accent-pink px-3 py-1.5 text-xs font-heading font-semibold uppercase text-white"
              >
                {t('update.action')}
              </button>
              <button type="button" aria-label={t('sheet.close')} onClick={close} className="text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-teal" aria-hidden />
              <p className="flex-1 text-xs text-white/80">{t('update.offlineReady')}</p>
              <button type="button" aria-label={t('sheet.close')} onClick={close} className="text-white/60">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
