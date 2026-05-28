import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getStats } from '../api'
import SectionHeader from '../components/SectionHeader'

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-border last:border-0 gap-4">
      <span className="font-mono text-text-secondary text-sm shrink-0">{label}</span>
      <span className={`font-mono text-sm text-right ${highlight ? 'text-green-bright' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  )
}

export default function System() {
  const { data: stats, loading } = useApi(getStats)

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-text-secondary font-mono text-sm animate-pulse">booting system...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader sub="who is this guy exactly · let me explain">
        system info
      </SectionHeader>

      {stats && (
        <div className="space-y-6">

          {/* Who am I */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-border bg-bg-elevated flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-accent" />
              <div className="w-2 h-2 rounded-full bg-yellow-accent" />
              <div className="w-2 h-2 rounded-full bg-green-mid" />
              <span className="text-text-secondary text-xs font-mono ml-2">~ whoami</span>
            </div>
            <div className="p-4 space-y-1">
              {[
                ['the government name',    stats.name],
                ['they call me',           stats.handle,          true],
                ['current version',        `v${stats.version}`,   true],
                ['dropped on',             stats.build_date],
                ['main quest rn',          stats.current_mission, true],
                ['status',                 stats.status,          true],
                ['been running for',       stats.uptime],
                ['base of operations',     stats.location],
                ['powered by (fr)',        stats.faith],
              ].map(([label, value, hi]) => (
                <Row key={label} label={label} value={value} highlight={hi} />
              ))}
            </div>
          </motion.div>

          {/* Numbers that matter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-border bg-bg-elevated">
              <span className="text-text-secondary text-xs font-mono">~ numbers that matter</span>
            </div>
            <div className="p-4 space-y-1">
              {[
                ['nights I refused to sleep',          stats.all_nighters_survived],
                ['hackathons I walked into',           stats.hackathons_entered],
                ['hackathons I walked out with a W',   stats.hackathons_won,    true],
                ['bugs blamed on the framework',       stats.bugs_created],
                ['ideas born at 2am',                  stats.ideas_started],
                ['ideas that actually shipped',        stats.ideas_shipped,     true],
                ['songs stuck in my head rn',          stats.songs_on_repeat],
                ['prayers said (approx.)',             stats.prayers_said],
              ].map(([label, value, hi]) => (
                <Row key={label} label={label} value={value} highlight={hi} />
              ))}
            </div>
          </motion.div>

          {/* What's running */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-black border border-border rounded-lg p-4 font-mono text-xs space-y-2"
          >
            <p className="text-text-secondary mb-3">~ what's running in the background</p>
            {[
              ['cs degree (yr 1 of 4)',          '██░░░░', '34%',  '#58A6FF'],
              ['teenovatex labs',                 '███░░░', '78%',  '#39D353'],
              ['koded os v18 — shipping',         '█████░', '98%',  '#00FF41'],
              ['dsa grind (it never stops)',       '██░░░░', '41%',  '#BC8CFF'],
              ['faith & daily practice',          '█████░', '93%',  '#E3B341'],
              ['body control & discipline',       '█░░░░░', '20%',  '#F85149'],
              ['stackd bootcamp',                 '████░░', '67%',  '#4ECDC4'],
            ].map(([proc, bar, pct, color]) => (
              <div key={proc} className="flex items-center gap-3">
                <span style={{ color }} className="flex-1 truncate">{proc}</span>
                <span className="text-green-mid tracking-widest">{bar}</span>
                <span className="text-text-secondary w-8 text-right">{pct}</span>
              </div>
            ))}
          </motion.div>

        </div>
      )}
    </div>
  )
}
