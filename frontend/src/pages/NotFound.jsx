import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Typewriter from '../components/Typewriter'

const LINES = [
  'Segmentation fault (core dumped)',
  '',
  'Process:   koded_os_v18',
  'Path:      404 — not found',
  'Signal:    SIGSEGV',
  '',
  '> this page does not exist in this system.',
  '> try: cd /home',
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="w-full max-w-xl"
      >
        <div className="text-red-accent font-mono text-6xl font-bold mb-6">404</div>
        <Typewriter lines={LINES} speed={25} lineDelay={100} />
        <div className="mt-10">
          <Link
            to="/home"
            className="font-mono text-sm text-green-bright border border-green-bright/50 px-4 py-2 rounded hover:bg-green-dim/20 transition-all"
          >
            $ cd /home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
