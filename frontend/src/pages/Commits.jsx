import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getCommits } from '../api'
import SectionHeader from '../components/SectionHeader'

const TYPES = ['all', 'feat', 'fix', 'refactor', 'perf', 'chore', 'hotfix', 'revert', 'merge']

const TYPE_COLOR = {
  feat: '#39D353', fix: '#F85149', refactor: '#BC8CFF',
  perf: '#58A6FF', chore: '#888888', hotfix: '#F85149',
  revert: '#E3B341', merge: '#D29922',
}

function CommitCard({ commit }) {
  const [expanded, setExpanded] = useState(false)
  const color = TYPE_COLOR[commit.type] || '#888'
  const hash  = commit.id?.toString(16).padStart(7, '0').slice(0, 7) || 'a1b2c3d'

  return (
    <motion.div
      className="border border-border rounded-md overflow-hidden hover:border-green-dim/60 transition-colors cursor-pointer"
      onClick={() => commit.reflection && setExpanded(!expanded)}
    >
      <div className="bg-bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded shrink-0 mt-0.5"
            style={{ color, border: `1px solid ${color}33`, background: `${color}11` }}
          >
            {commit.type}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm text-text-primary">
              <span className="text-text-secondary">({commit.scope})</span>{': '}
              {commit.message}
            </p>
            <div className="flex flex-wrap gap-3 mt-1.5 text-xs font-mono text-text-secondary">
              <span className="text-green-dim">#{hash}</span>
              <span>{new Date(commit.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>{commit.branch}</span>
              {commit.tag && <span className="text-yellow-accent">tag: {commit.tag}</span>}
            </div>
          </div>
          {commit.reflection && (
            <span className="text-text-secondary text-xs shrink-0">{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && commit.reflection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="terminal-border mx-4 mb-3 pl-3 pr-2 py-2 text-xs font-mono text-text-secondary leading-relaxed">
              <span className="text-green-bright">// </span>{commit.reflection}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Commits() {
  const [activeType, setActiveType] = useState('all')
  const { data: commits, loading, error, retry } = useApi(
    () => getCommits(activeType === 'all' ? null : activeType),
    [activeType]
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader sub="life events written in git syntax · click to expand reflection">
        git log --life
      </SectionHeader>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className="text-xs font-mono px-2.5 py-1 rounded transition-all"
            style={
              activeType === t
                ? { color: TYPE_COLOR[t] || '#00FF41', border: `1px solid ${TYPE_COLOR[t] || '#00FF41'}`, background: `${TYPE_COLOR[t] || '#00FF41'}11` }
                : { color: '#888', border: '1px solid #2a2a2a' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-secondary font-mono text-sm animate-pulse">loading commits...</p>
      ) : error ? (
        <div className="terminal-border pl-4 py-3 rounded-r-md">
          <p className="text-red-accent font-mono text-sm">error: could not fetch commits</p>
          <button
            onClick={retry}
            className="mt-2 text-xs font-mono text-green-bright hover:underline"
          >
            $ retry →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {commits?.map((c) => <CommitCard key={c.id} commit={c} />)}
          {commits?.length === 0 && (
            <p className="text-text-secondary font-mono text-sm">no commits found for type: {activeType}</p>
          )}
        </div>
      )}
    </div>
  )
}
