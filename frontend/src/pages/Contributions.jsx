import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getMemories } from '../api'
import SectionHeader from '../components/SectionHeader'

const CATEGORY_META = {
  growth:     { color: '#39D353', label: 'locked in & growing' },
  productive: { color: '#26a641', label: 'consistent' },
  emotional:  { color: '#58A6FF', label: 'feelings & people' },
  experiment: { color: '#E3B341', label: 'trying new stuff' },
  difficult:  { color: '#F85149', label: 'rough patches' },
  faith:      { color: '#BC8CFF', label: 'faith' },
  basketball: { color: '#D29922', label: 'moving my body' },
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

function buildGrid(memories) {
  const map = {}
  memories?.forEach((m) => { map[m.date] = m })

  const start = new Date('2025-06-01')
  const end   = new Date('2026-05-31')
  const days  = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    days.push({ date: key, memory: map[key] || null })
  }
  return days
}

function MemoryModal({ memory, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-bg-elevated border border-border rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                color: CATEGORY_META[memory.category]?.color || '#888',
                border: `1px solid ${CATEGORY_META[memory.category]?.color || '#888'}`,
              }}
            >
              {CATEGORY_META[memory.category]?.label || memory.category}
            </span>
            <h3 className="font-mono text-text-primary text-lg mt-2">{memory.title}</h3>
            <p className="text-text-secondary text-xs font-mono mt-1">{memory.date}</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-lg ml-4">✕</button>
        </div>

        <p className="text-text-primary text-sm leading-relaxed font-mono">{memory.description}</p>

        {memory.quote && (
          <blockquote className="mt-4 border-l-2 border-green-bright pl-3 text-text-secondary text-sm italic font-serif">
            "{memory.quote}"
          </blockquote>
        )}
        {memory.song && (
          <p className="mt-3 text-text-secondary text-xs font-mono">
            <span className="text-green-bright">♪</span> {memory.song}
          </p>
        )}
        {memory.code_snippet && (
          <pre className="mt-4 bg-black p-3 rounded text-xs font-mono text-green-bright overflow-x-auto border border-green-dim/30">
            {memory.code_snippet}
          </pre>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Contributions() {
  const { data: memories, loading } = useApi(getMemories)
  const [selected, setSelected] = useState(null)

  const grid = buildGrid(memories)
  const weeks = []
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SectionHeader sub="age 17 → 18 · every colored square is a real day · tap it">
        the whole year
      </SectionHeader>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(CATEGORY_META).map(([k, { color, label }]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs font-mono text-text-secondary">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-text-secondary font-mono text-sm animate-pulse">pulling up the archive...</p>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[4px]" style={{ minWidth: 'max-content' }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[4px]">
                {week.map(({ date, memory }, di) => (
                  <motion.div
                    key={date}
                    className="w-[14px] h-[14px] rounded-sm cursor-pointer transition-transform"
                    style={{
                      background: memory
                        ? (CATEGORY_META[memory.category]?.color || '#39D353')
                        : FILL[Math.floor(rng(wi * 7 + di) * FILL.length)],
                      opacity: memory ? 1 : (0.12 + rng(wi * 7 + di + 1000) * 0.55),
                    }}
                    whileHover={{ scale: memory ? 1.4 : 1.2 }}
                    onClick={() => memory && setSelected(memory)}
                    title={memory ? memory.title : date}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-text-secondary text-xs font-mono">
        {memories?.length ?? 0} moments stored · {grid.filter((d) => d.memory).length} days that meant something
      </p>

      <AnimatePresence>
        {selected && <MemoryModal memory={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
