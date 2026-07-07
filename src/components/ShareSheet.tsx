import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Facebook, Instagram, Link2, Share2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { gymInfo } from '@/data/gymInfo'

const SITE_URL = 'https://tmkfitness.no/'

/**
 * Bottom-sheet share dialog. Uses the native Web Share API when available and
 * always offers explicit Facebook / Instagram / copy-link actions.
 */
export function ShareSheet({
  open,
  onClose,
  text,
  url = SITE_URL,
}: {
  open: boolean
  onClose: () => void
  text: string
  url?: string
}) {
  const { t } = useLanguage()
  const [note, setNote] = useState<string | null>(null)

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const flash = (msg: string) => {
    setNote(msg)
    window.setTimeout(() => setNote(null), 1800)
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: 'TMK Fitness', text, url })
      onClose()
    } catch {
      /* user cancelled */
    }
  }

  const shareFacebook = () => {
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}&quote=${encodeURIComponent(text)}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const shareInstagram = () => {
    // Instagram has no web share URL — copy the caption and open the gym's IG.
    try {
      navigator.clipboard?.writeText(`${text} ${url}`)
    } catch {
      /* clipboard unavailable */
    }
    window.open(gymInfo.instagram, '_blank', 'noopener,noreferrer')
    flash(t('share.igHint'))
  }

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(`${text} ${url}`)
    } catch {
      /* clipboard unavailable */
    }
    flash(t('share.copied'))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="relative w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-sheet safe-bottom safe-x"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            <h3 className="mb-1 font-heading text-lg font-bold uppercase tracking-wide text-secondary">
              {t('share.title')}
            </h3>
            <p className="mb-4 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
              “{text}”
            </p>

            <div className="grid grid-cols-4 gap-3 text-center">
              {canNativeShare && (
                <ShareButton onClick={nativeShare} label={t('share.native')} tone="bg-secondary">
                  <Share2 className="h-5 w-5" />
                </ShareButton>
              )}
              <ShareButton onClick={shareFacebook} label="Facebook" tone="bg-[#1877F2]">
                <Facebook className="h-5 w-5" />
              </ShareButton>
              <ShareButton
                onClick={shareInstagram}
                label="Instagram"
                tone="bg-gradient-to-br from-accent-pink to-primary"
              >
                <Instagram className="h-5 w-5" />
              </ShareButton>
              <ShareButton onClick={copyLink} label={t('share.copyLink')} tone="bg-primary">
                <Link2 className="h-5 w-5" />
              </ShareButton>
            </div>

            <AnimatePresence>
              {note && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs text-primary"
                >
                  <Check className="h-3.5 w-3.5" />
                  {note}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ShareButton({
  onClick,
  label,
  tone,
  children,
}: {
  onClick: () => void
  label: string
  tone: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${tone}`}>
        {children}
      </span>
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
    </button>
  )
}
