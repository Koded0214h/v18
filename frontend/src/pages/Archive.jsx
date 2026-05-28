import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getScrapbook } from '../api'
import SectionHeader from '../components/SectionHeader'

const CATS = ['all', 'hackathon', 'code', 'people', 'basketball', 'random']

export default function Archive() {
  const [cat, setCat] = useState(null)
  const { data: items, loading } = useApi(
    () => getScrapbook(cat),
    [cat]
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SectionHeader sub="polaroid fragments of age 17">digital scrapbook</SectionHeader>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c === 'all' ? null : c)}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition-all ${
              (cat === null && c === 'all') || cat === c
                ? 'text-green-bright border-green-bright bg-green-dim/20'
                : 'text-text-secondary border-border hover:border-text-secondary'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-secondary font-mono text-sm animate-pulse">loading archive...</p>
      ) : items?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-secondary font-mono text-sm">no items in this category yet.</p>
          <p className="text-text-secondary text-xs font-mono mt-1">owner uploads via /admin</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: (i % 2 === 0 ? 1 : -1) * (Math.random() * 2 + 0.5) }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
              className="break-inside-avoid bg-bg-surface border border-border p-2 pb-4 rounded shadow-card cursor-pointer inline-block w-full"
            >
              <div className="bg-bg-elevated aspect-square rounded overflow-hidden mb-3">
                <img
                  src={item.image_url}
                  alt={item.caption || item.category}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {item.caption && (
                <p className="text-text-secondary text-xs font-mono text-center px-1">{item.caption}</p>
              )}
              {item.date_taken && (
                <p className="text-text-secondary text-xs font-mono text-center mt-0.5 opacity-60">
                  {new Date(item.date_taken).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
