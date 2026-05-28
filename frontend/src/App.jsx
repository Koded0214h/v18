import { useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'

import BootScreen    from './pages/BootScreen'
import Home          from './pages/Home'
import Contributions from './pages/Contributions'
import Commits       from './pages/Commits'
import Messages      from './pages/Messages'
import Oracle        from './pages/Oracle'
import WorldMap      from './pages/WorldMap'
import Logs          from './pages/Logs'
import Roadmap       from './pages/Roadmap'
import Archive       from './pages/Archive'
import System        from './pages/System'
import Terminal      from './pages/Terminal'
import NotFound      from './pages/NotFound'
import Sudo          from './pages/Sudo'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

function useKonami(onSuccess) {
  useEffect(() => {
    let seq = []
    function onKey(e) {
      seq = [...seq, e.key].slice(-KONAMI.length)
      if (seq.join(',') === KONAMI.join(',')) onSuccess()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSuccess])
}

function useWhoami() {
  useEffect(() => {
    function onKey(e) {
      const active = document.activeElement
      if (!active || !['INPUT','TEXTAREA'].includes(active.tagName)) return
      const val = (active.value || '') + e.key
      if (val.toLowerCase().endsWith('whoami')) {
        active.value = 'Abdulrahman. Still figuring it out.'
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

function BootGate({ children }) {
  const booted = localStorage.getItem('booted')
  return booted ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const navigate = useNavigate()
  const goTerminal = useCallback(() => navigate('/terminal'), [navigate])
  useKonami(goTerminal)
  useWhoami()

  return (
    <Routes>
      {/* Boot screen — full page, no layout */}
      <Route path="/" element={<BootScreen />} />
      <Route path="/sudo" element={<Sudo />} />
      <Route path="/terminal" element={<Terminal />} />

      {/* Main layout pages */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/home"          element={<BootGate><Home /></BootGate>} />
            <Route path="/contributions" element={<BootGate><Contributions /></BootGate>} />
            <Route path="/commits"       element={<BootGate><Commits /></BootGate>} />
            <Route path="/messages"      element={<BootGate><Messages /></BootGate>} />
            <Route path="/oracle"        element={<BootGate><Oracle /></BootGate>} />
            <Route path="/map"           element={<BootGate><WorldMap /></BootGate>} />
            <Route path="/logs"          element={<BootGate><Logs /></BootGate>} />
            <Route path="/roadmap"       element={<BootGate><Roadmap /></BootGate>} />
            <Route path="/archive"       element={<BootGate><Archive /></BootGate>} />
            <Route path="/system"        element={<BootGate><System /></BootGate>} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
