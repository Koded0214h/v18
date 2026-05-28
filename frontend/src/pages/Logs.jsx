import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getJournal, getJournalEntry } from '../api'
import SectionHeader from '../components/SectionHeader'

function renderMarkdown(text) {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="font-mono font-bold text-text-primary text-base mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-mono font-bold text-green-bright text-lg mt-8 mb-3">$2</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-mono font-bold text-text-primary text-2xl mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-green-bright pl-4 my-3 text-text-secondary italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-text-secondary">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[hblp])/gm, '')
}

function EntryDetail({ entry, onBack }) {
  const content = renderMarkdown(entry.content)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button onClick={onBack} className="text-text-secondary text-xs font-mono hover:text-green-bright mb-6 flex items-center gap-1">
        ← back
      </button>
      <p className="text-text-secondary text-xs font-mono mb-1">
        {new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <h1 className="text-2xl font-mono text-text-primary mb-8">{entry.title}</h1>
      <article
        className="prose-custom font-serif text-text-secondary leading-relaxed max-w-2xl space-y-4"
        dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${content}</p>` }}
      />
    </motion.div>
  )
}

export default function Logs() {
  const { data: entries, loading } = useApi(getJournal)
  const [selected, setSelected]   = useState(null)
  const [detail, setDetail]       = useState(null)

  async function openEntry(entry) {
    setSelected(entry.id)
    try {
      const full = await getJournalEntry(entry.id)
      setDetail(full)
    } catch {
      setDetail(entry)
    }
  }

  if (detail) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <EntryDetail entry={detail} onBack={() => { setDetail(null); setSelected(null) }} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader sub="thoughts I wrote down · raw, honest, personal">things I had to say</SectionHeader>

      {loading ? (
        <p className="text-text-secondary font-mono text-sm animate-pulse">loading the archives...</p>
      ) : (
        <div className="space-y-1">
          {entries?.map((entry, i) => (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => openEntry(entry)}
              className="w-full text-left border border-border rounded-lg px-5 py-4 hover:border-green-dim/60 hover:bg-bg-surface/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-mono text-text-primary group-hover:text-green-bright transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-text-secondary text-sm font-serif mt-1 leading-relaxed">{entry.excerpt}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-text-secondary text-xs font-mono">
                    {new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-green-bright text-xs font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    read →
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
