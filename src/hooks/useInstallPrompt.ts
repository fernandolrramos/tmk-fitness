import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Wraps the `beforeinstallprompt` flow. Exposes whether the app can be
 * installed (and isn't already running standalone) plus a promptInstall().
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(display-mode: standalone)').matches ||
        // iOS Safari
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      : false,
  )

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  return {
    /** Can we surface an install hint? (installable and not already installed) */
    canInstall: !installed && deferred !== null,
    installed,
    promptInstall,
  }
}
