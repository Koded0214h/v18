import { useState, useEffect } from 'react'

const BIRTHDAY = new Date('2026-05-31T00:00:00+01:00') // WAT

function pad(n) { return String(n).padStart(2, '0') }

export default function CountdownTimer() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = BIRTHDAY - now

  if (diff > 0) {
    const days    = Math.floor(diff / 86400000)
    const hours   = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)

    return (
      <div className="font-mono text-sm">
        <p className="text-text-secondary mb-1">deploying in...</p>
        <p className="text-green-bright text-xl glow-green tabular-nums">
          {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
        </p>
      </div>
    )
  }

  const daysSince = Math.floor((now - BIRTHDAY) / 86400000)

  if (daysSince === 0) {
    return (
      <div className="font-mono text-sm space-y-1">
        <p className="text-green-bright glow-green">✓ koded_os_v18 deployed successfully.</p>
        <p className="text-text-secondary">May 31, 2026 — 00:00:00</p>
        <p className="text-green-bright">&gt; happy birthday, Abdulrahman.</p>
      </div>
    )
  }

  return (
    <div className="font-mono text-sm space-y-1">
      <p className="text-green-bright">koded_os_v18 — released.</p>
      <p className="text-text-secondary">deployed {daysSince} day{daysSince !== 1 ? 's' : ''} ago.</p>
    </div>
  )
}
