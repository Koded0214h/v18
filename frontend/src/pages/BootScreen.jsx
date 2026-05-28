import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from '../components/Typewriter'

const BOOT_LINES = [
  'booting koded_os_v18...',
  'loading memories...',
  'checking system integrity...',
  'initializing future...',
  '> all systems nominal.',
  '> welcome.',
]

export default function BootScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [typeDone, setTypeDone] = useState(false)
  const [exiting, setExiting] = useState(false)

  const proceed = useCallback(() => {
    if (exiting) return
    setExiting(true)
    localStorage.setItem('booted', 'true')
    setTimeout(() => navigate('/home'), 600)
  }, [exiting, navigate])

  // auto-proceed 2s after typing done
  useEffect(() => {
    if (!typeDone) return
    const t = setTimeout(proceed, 2000)
    return () => clearTimeout(t)
  }, [typeDone, proceed])

  // progress bar
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); return 100 }
        return p + 2
      })
    }, 80)
    return () => clearInterval(t)
  }, [])

  // skip on any key or click
  useEffect(() => {
    const skip = () => proceed()
    window.addEventListener('keydown', skip)
    window.addEventListener('touchstart', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('touchstart', skip)
    }
  }, [proceed])

  return (
    <motion.div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer scanlines"
      onClick={proceed}
      initial={{ opacity: 1 }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-xl px-8">
        <Typewriter lines={BOOT_LINES} onDone={() => setTypeDone(true)} speed={35} lineDelay={200} />

        {/* progress bar */}
        <div className="mt-8 w-full h-px bg-green-dim/40 overflow-hidden">
          <motion.div
            className="h-full bg-green-bright"
            style={{ boxShadow: '0 0 8px #00FF41' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs font-mono text-green-dim">
          <span>loading...</span>
          <span>{progress}%</span>
        </div>

        {typeDone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-xs font-mono text-text-secondary"
          >
            press any key or click to continue
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
