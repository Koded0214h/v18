import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getStats } from '../api'
import SectionHeader from '../components/SectionHeader'

function StatRow({ label, value, highlight }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-border last:border-0">
      <span className="font-mono text-text-secondary text-sm">{label}</span>
      <span className={`font-mono text-sm ${highlight ? 'text-green-bright' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  )
}

export default function System() {
  const { data: stats, loading } = useApi(getStats)

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-text-secondary font-mono text-sm animate-pulse">loading system stats...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader sub="current process state · htop style">system stats</SectionHeader>

      {stats && (
        <div className="space-y-6">
          {/* Identity block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-border bg-bg-elevated flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-accent" />
              <div className="w-2 h-2 rounded-full bg-yellow-accent" />
              <div className="w-2 h-2 rounded-full bg-green-mid" />
              <span className="text-text-secondary text-xs font-mono ml-2">identity.yaml</span>
            </div>
            <div className="p-4 space-y-1">
              {[
                ['Name',             stats.name],
                ['Handle',           stats.handle,           true],
                ['Version',          stats.version,          true],
                ['Build Date',       stats.build_date],
                ['Current Mission',  stats.current_mission,  true],
                ['Status',           stats.status,           true],
                ['Uptime',           stats.uptime],
                ['Location',         stats.location],
                ['Faith',            stats.faith],
              ].map(([label, value, hi]) => (
                <StatRow key={label} label={label} value={value} highlight={hi} />
              ))}
            </div>
          </motion.div>

          {/* Fun stats block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-bg-surface border border-border rounded-lg overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-border bg-bg-elevated">
              <span className="text-text-secondary text-xs font-mono">metrics.yaml</span>
            </div>
            <div className="p-4 space-y-1">
              {[
                ['all_nighters_survived',   stats.all_nighters_survived],
                ['hackathons_entered',      stats.hackathons_entered],
                ['hackathons_won',          stats.hackathons_won,         true],
                ['bugs_created',            stats.bugs_created],
                ['ideas_started',           stats.ideas_started],
                ['ideas_shipped',           stats.ideas_shipped,          true],
                ['songs_on_repeat',         stats.songs_on_repeat],
                ['prayers_said',            stats.prayers_said],
              ].map(([label, value, hi]) => (
                <StatRow key={label} label={label} value={value} highlight={hi} />
              ))}
            </div>
          </motion.div>

          {/* Process list */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-black border border-border rounded-lg p-4 font-mono text-xs space-y-1"
          >
            <p className="text-text-secondary mb-2">PID  PROCESS                     CPU    MEM</p>
            {[
              ['001', 'university.cs_degree',       '██░░░░', '34%'],
              ['002', 'teenovatex_labs.build',       '███░░░', '78%'],
              ['003', 'koded_os_v18.ship',           '█████░', '98%'],
              ['004', 'dsa_prep.leetcode',           '██░░░░', '41%'],
              ['005', 'faith.daily_practice',        '█████░', '93%'],
              ['006', 'body_control',                '█░░░░░', '20%'],
              ['007', 'stackd.bootcamp',             '████░░', '67%'],
            ].map(([pid, proc, bar, pct]) => (
              <div key={pid} className="flex items-center gap-4">
                <span className="text-text-secondary w-8">{pid}</span>
                <span className="text-green-bright w-36 truncate">{proc}</span>
                <span className="text-green-mid text-xs">{bar}</span>
                <span className="text-text-secondary">{pct}</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}
