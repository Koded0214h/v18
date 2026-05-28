import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import BirthdaySprites from './BirthdaySprites'

const NAV = [
  { to: '/home', label: '~/home' },
  { to: '/contributions', label: 'memories/' },
  { to: '/commits', label: 'git log' },
  { to: '/messages', label: 'messages' },
  { to: '/oracle', label: 'oracle' },
  { to: '/map', label: 'map' },
  { to: '/logs', label: 'journal' },
  { to: '/roadmap', label: 'roadmap' },
  { to: '/system', label: 'system' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef(null)

  const PLAYLIST = ['/minions_banana.mp3', '/minion_la_bamba.mp3', '/minions_happy_birthd.mp3']
  const trackRef = useRef(0)

  // initialise audio once
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0])
    audio.volume = 0.35
    audio.addEventListener('ended', () => {
      trackRef.current = (trackRef.current + 1) % PLAYLIST.length
      audio.src = PLAYLIST[trackRef.current]
      audio.play().catch(() => {})
    })
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  // start playing on first user interaction (browser autoplay policy)
  useEffect(() => {
    function tryPlay() {
      if (!muted && audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    }
    window.addEventListener('click', tryPlay)
    window.addEventListener('keydown', tryPlay)
    return () => {
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('keydown', tryPlay)
    }
  }, [muted])

  // sync play/pause with muted state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }, [muted])

  // close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <BirthdaySprites />
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <Link to="/home" className="font-mono text-green-bright text-sm glow-green hover:opacity-80 transition-opacity">
            koded@os:~$
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-all duration-150 ${
                  location.pathname === to
                    ? 'text-green-bright bg-green-dim/30 border border-green-dim'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMuted(!muted)}
              className="text-text-secondary hover:text-green-bright transition-colors text-xs font-mono"
              aria-label={muted ? 'unmute' : 'mute'}
            >
              {muted ? '♪ muted' : '♪ banana'}
            </button>
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="menu"
            >
              <span className="font-mono text-sm">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-bg-surface overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-1">
                {NAV.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-2 text-sm font-mono rounded transition-colors ${
                      location.pathname === to
                        ? 'text-green-bright bg-green-dim/30'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-4 text-center">
        <p className="text-text-secondary text-xs font-mono">
          koded_os_v18 — build 2026.05.31 — <span className="text-green-bright">I AM KODED</span>
        </p>
      </footer>
    </div>
  )
}
