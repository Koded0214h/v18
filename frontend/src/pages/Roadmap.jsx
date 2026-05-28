import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getRoadmap } from '../api'
import SectionHeader from '../components/SectionHeader'

const VERSION_META = {
  v18: { label: 'v18.0.0', date: 'May 31, 2026', status: 'CURRENT', color: '#00FF41' },
  v19: { label: 'v19.0.0', date: 'May 31, 2027', status: 'PLANNED', color: '#58A6FF' },
  v20: { label: 'v20.0.0', date: 'May 31, 2028', status: 'VISION',  color: '#BC8CFF' },
}

export default function Roadmap() {
  const { data: roadmap, loading } = useApi(getRoadmap)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader sub="personal milestones framed as version changelogs">roadmap to v20</SectionHeader>

      {loading ? (
        <p className="text-text-secondary font-mono text-sm animate-pulse">loading roadmap...</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(VERSION_META).map(([vKey, meta], vi) => {
            const items = roadmap?.[vKey] || []
            const done  = items.filter((i) => i.is_done).length
            const pct   = items.length ? Math.round((done / items.length) * 100) : 0
            const isCurrent = meta.status === 'CURRENT'

            return (
              <motion.div
                key={vKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: vi * 0.1 }}
                className={`border rounded-lg p-6 ${isCurrent ? 'border-green-bright/40' : 'border-border opacity-80'}`}
                style={isCurrent ? { boxShadow: '0 0 20px rgba(0,255,65,0.06)' } : {}}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-mono text-lg" style={{ color: meta.color }}>{meta.label}</h3>
                    <p className="text-text-secondary text-xs font-mono mt-0.5">{meta.date}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded border"
                      style={{ color: meta.color, borderColor: `${meta.color}40`, background: `${meta.color}11` }}
                    >
                      {meta.status}
                    </span>
                    {items.length > 0 && (
                      <p className="text-text-secondary text-xs font-mono mt-1">{pct}% complete</p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {items.length > 0 && (
                  <div className="h-px bg-border mb-4 overflow-hidden rounded">
                    <motion.div
                      className="h-full rounded"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: vi * 0.1 + 0.3 }}
                    />
                  </div>
                )}

                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3 font-mono text-sm">
                      <span className="mt-0.5 shrink-0" style={{ color: item.is_done ? meta.color : '#2a2a2a' }}>
                        {item.is_done ? '✓' : '○'}
                      </span>
                      <span className={item.is_done ? 'line-through text-text-secondary' : 'text-text-primary'}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
