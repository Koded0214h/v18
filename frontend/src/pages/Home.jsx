import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getMemories, getCommits } from '../api'
import CountdownTimer from '../components/CountdownTimer'
import SectionHeader from '../components/SectionHeader'
import MessageModal from '../components/MessageModal'

const CATEGORY_COLOR = {
  growth: '#39D353', productive: '#00FF41', emotional: '#58A6FF',
  experiment: '#E3B341', difficult: '#F85149', faith: '#BC8CFF',
  basketball: '#D29922', rest: '#4ECDC4', social: '#FF6B9D',
}

const FILL = [
  '#39D353','#00FF41','#58A6FF','#BC8CFF','#E3B341',
  '#F85149','#D29922','#4ECDC4','#FF6B9D','#6C5CE7',
  '#F8B500','#C44569','#00CEC9','#A29BFE','#FD79A8',
]

function rng(s) {
  const x = Math.sin(s * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function MiniGrid({ memories }) {
  const recent = memories?.slice(-182) ?? []
  return (
    <div className="flex gap-[3px] flex-wrap">
      {Array.from({ length: 182 }).map((_, i) => {
        const m = recent[i]
        const color = m
          ? (CATEGORY_COLOR[m.category] || '#39D353')
          : FILL[Math.floor(rng(i) * FILL.length)]
        const opacity = m ? 1 : (0.18 + rng(i + 500) * 0.78)
        return (
          <div
            key={i}
            className="w-3 h-3 rounded-sm transition-all duration-150 hover:scale-125"
            style={{ background: color, opacity }}
            title={m?.title}
          />
        )
      })}
    </div>
  )
}

function CommitRow({ commit }) {
  const typeColors = {
    feat: '#39D353', fix: '#F85149', refactor: '#BC8CFF',
    perf: '#58A6FF', chore: '#888', hotfix: '#F85149',
    revert: '#E3B341', merge: '#D29922',
  }
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0 hover:bg-bg-surface/50 px-2 rounded transition-colors">
      <span className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0 mt-0.5"
        style={{ color: typeColors[commit.type] || '#888', border: `1px solid ${typeColors[commit.type] || '#444'}` }}>
        {commit.type}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono text-text-primary truncate">
          <span className="text-text-secondary">({commit.scope})</span>{' '}
          {commit.message}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          {new Date(commit.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}{commit.branch}
        </p>
      </div>
    </div>
  )
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

export default function Home() {
  const { data: memories } = useApi(getMemories)
  const { data: commits } = useApi(getCommits)

  return (
    <>
    <MessageModal />
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
      {/* Hero */}
      <motion.section {...fade(0)} className="space-y-4">
        <p className="text-text-secondary text-xs font-mono">koded@os:~$ whoami</p>
        <h1 className="text-4xl md:text-6xl font-mono font-bold text-text-primary leading-tight">
          Abdulrahman<br />
          <span className="text-green-bright glow-green">Raufu</span>
        </h1>
        <p className="text-text-secondary font-mono text-sm max-w-xl">
          v18.0.0 · Lagos, Nigeria · CS student · builder · Muslim ·{' '}
          <span className="text-green-bright">becoming undeniable</span>
        </p>
        <CountdownTimer />
      </motion.section>

      <div className="h-px bg-border" />

      {/* Contribution preview */}
      <motion.section {...fade(0.1)}>
        <SectionHeader sub="last 6 months of memory">contribution graph</SectionHeader>
        <MiniGrid memories={memories} />
        <div className="mt-3 flex justify-between items-center">
          <p className="text-text-secondary text-xs font-mono">{memories?.length ?? 0} memories stored</p>
          <Link to="/contributions" className="text-xs font-mono text-green-bright hover:underline">
            view full grid →
          </Link>
        </div>
      </motion.section>

      <div className="h-px bg-border" />

      {/* Recent commits */}
      <motion.section {...fade(0.15)}>
        <SectionHeader sub="latest life events">recent commits</SectionHeader>
        <div className="bg-bg-surface border border-border rounded-md overflow-hidden">
          {commits?.slice(0, 5).map((c) => <CommitRow key={c.id} commit={c} />)}
        </div>
        <div className="mt-3 text-right">
          <Link to="/commits" className="text-xs font-mono text-green-bright hover:underline">
            git log --all →
          </Link>
        </div>
      </motion.section>

      <div className="h-px bg-border" />

      {/* System stats compact */}
      <motion.section {...fade(0.2)}>
        <SectionHeader sub="current process state">system stats</SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { k: 'projects',       v: '103',           color: '#00FF41' },
            { k: 'hackathons_won', v: '6',             color: '#E3B341' },
            { k: 'all_nighters',   v: '30',            color: '#F85149' },
            { k: 'ideas_shipped',  v: 'classified',    color: '#BC8CFF' },
            { k: 'version',        v: 'v18.0.0',       color: '#58A6FF' },
            { k: 'status',         v: 'grinding 24/7', color: '#4ECDC4' },
          ].map(({ k, v, color }) => (
            <div key={k} className="bg-bg-surface border border-border rounded px-3 py-2">
              <p className="text-text-secondary text-xs font-mono">{k}</p>
              <p className="font-mono text-sm mt-0.5" style={{ color }}>{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link to="/system" className="text-xs font-mono text-green-bright hover:underline">
            htop /system →
          </Link>
        </div>
      </motion.section>

      <div className="h-px bg-border" />

      {/* CTA strip */}
      <motion.section {...fade(0.25)}>
        <SectionHeader>interact</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { to: '/messages', label: '$ git commit -m "your message"', sub: 'leave a message' },
            { to: '/oracle', label: '> consult the oracle', sub: 'make a wish' },
            { to: '/map', label: '$ pin --location "your city"', sub: 'drop a pin on the map' },
          ].map(({ to, label, sub }) => (
            <Link
              key={to}
              to={to}
              className="terminal-border pl-4 pr-3 py-3 rounded-r-md hover:bg-green-dim/10 transition-all group"
            >
              <p className="text-green-bright text-xs font-mono group-hover:glow-green transition-all">{label}</p>
              <p className="text-text-secondary text-xs mt-1">{sub}</p>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
    </>
  )
}
