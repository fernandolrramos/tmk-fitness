import { useLocation, useOutlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { InstallChip } from '@/components/InstallChip'
import { UpdateToast } from '@/components/UpdateToast'

/** Shell for the member-facing app: header + animated content + bottom nav. */
export function MemberLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col bg-slate-100">
      <Header />
      <InstallChip />
      <div className="flex-1">
        {/* Keyed enter animation per route — no AnimatePresence "wait" state,
            which can wedge at opacity:0 under rapid/interrupted navigation. */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="mx-auto min-h-full max-w-lg pb-24"
        >
          {outlet}
        </motion.main>
      </div>
      <BottomNav />
      <UpdateToast />
    </div>
  )
}
