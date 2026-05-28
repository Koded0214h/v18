import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getWishes, postWish } from '../api'
import SectionHeader from '../components/SectionHeader'

function WishCard({ wish }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface border border-border rounded-lg p-5 space-y-3"
    >
      <div className="flex justify-between items-start">
        <span className="text-text-secondary text-xs font-mono">{wish.name || 'Anonymous'}</span>
        <span className="text-text-secondary text-xs font-mono">
          {new Date(wish.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      <p className="text-text-primary text-sm font-mono leading-relaxed">"{wish.wish_text}"</p>
      <div className="border-t border-border pt-3">
        <p className="text-xs text-text-secondary font-mono mb-1">
          <span className="text-purple-accent">the oracle said:</span>
        </p>
        <p className="text-purple-accent text-sm font-mono leading-relaxed italic">{wish.prophecy}</p>
      </div>
    </motion.div>
  )
}

export default function Oracle() {
  const { data: wishes, loading } = useApi(getWishes)
  const [submitted, setSubmitted] = useState([])
  const [form, setForm]           = useState({ name: '', wish_text: '' })
  const [sending, setSending]     = useState(false)
  const [error, setError]         = useState('')

  const all = [...submitted, ...(wishes || [])]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const result = await postWish(form)
      setSubmitted((s) => [result, ...s])
      setForm({ name: '', wish_text: '' })
    } catch (err) {
      const msg = err?.response?.data?.error || 'The Oracle is silent. Try again.'
      setError(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <SectionHeader sub="speak a wish for him · the oracle will respond">the oracle</SectionHeader>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-10"
      >
        <p className="text-purple-accent font-mono text-sm glow-green" style={{ textShadow: '0 0 10px rgba(188,140,255,0.5)' }}>
          The Oracle is listening...
        </p>
        <p className="text-text-secondary text-xs font-mono mt-2">
          speak your wish for him. something will speak back.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-bg-surface border border-purple-accent/30 rounded-lg p-5 mb-10 space-y-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="your name (optional)"
          className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-purple-accent/60 outline-none transition-colors"
        />
        <textarea
          required
          value={form.wish_text}
          onChange={(e) => setForm({ ...form, wish_text: e.target.value })}
          maxLength={500}
          rows={3}
          placeholder="what do you wish for him?"
          className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-purple-accent/60 outline-none transition-colors resize-none"
        />
        <p className="text-xs text-text-secondary text-right">{form.wish_text.length}/500</p>

        {error && <p className="text-red-accent text-xs font-mono">{error}</p>}

        <button
          type="submit"
          disabled={sending || form.wish_text.trim().length < 5}
          className="w-full py-2.5 rounded font-mono text-sm border border-purple-accent/60 text-purple-accent hover:bg-purple-accent/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {sending ? 'consulting the oracle...' : '> invoke oracle'}
        </button>
      </form>

      {/* Loading oracle */}
      <AnimatePresence>
        {sending && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center mb-8"
          >
            <p className="text-purple-accent font-mono text-sm animate-pulse">consulting the oracle...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery */}
      <div className="space-y-4">
        {loading && <p className="text-text-secondary font-mono text-sm animate-pulse">summoning past prophecies...</p>}
        {!loading && all.length === 0 && (
          <p className="text-text-secondary font-mono text-sm text-center">no one's spoken yet · be the first</p>
        )}
        {all.map((w, i) => <WishCard key={w.id ?? `new-${i}`} wish={w} />)}
      </div>
    </div>
  )
}
