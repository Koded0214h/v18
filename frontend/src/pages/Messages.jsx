import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getMessages, postMessage } from '../api'
import SectionHeader from '../components/SectionHeader'

const TYPES = ['commit', 'pr', 'issue', 'log']

function formatMessage(msg) {
  const hash = Math.random().toString(16).slice(2, 9)
  const ts   = new Date(msg.created_at).toISOString().replace('T', ' ').slice(0, 19)
  switch (msg.type) {
    case 'commit': return `commit ${hash}: ${msg.message}`
    case 'pr':     return `PR #18 approved: ${msg.message}`
    case 'issue':  return `Issue #${msg.id}: ${msg.message}`
    case 'log':    return `[INFO] ${ts}: ${msg.message}`
    default:       return msg.message
  }
}

function MessageCard({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-border pl-3 pr-4 py-3 rounded-r-md"
    >
      <p className="font-mono text-green-bright text-xs break-all">{formatMessage(msg)}</p>
      <div className="flex gap-3 mt-1.5 text-xs font-mono text-text-secondary">
        <span>{msg.name || 'Anonymous'}</span>
        {msg.location && <span>· {msg.location}</span>}
        <span>· {new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
      </div>
    </motion.div>
  )
}

export default function Messages() {
  const { data: messages, loading, error } = useApi(getMessages)
  const [submitted, setSubmitted] = useState([])
  const [form, setForm] = useState({ name: '', message: '', type: 'commit', location: '' })
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [success, setSuccess] = useState(false)

  const all = [...(submitted), ...(messages || [])]

  async function handleSubmit(e) {
    e.preventDefault()
    setSendError('')
    setSending(true)
    try {
      const result = await postMessage(form)
      setSubmitted((s) => [result, ...s])
      setForm({ name: '', message: '', type: 'commit', location: '' })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Something went wrong.'
      setSendError(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader sub="say something · anything · I read every single one">the wall</SectionHeader>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-bg-surface border border-border rounded-lg p-5 mb-10 space-y-4">
        <p className="text-text-secondary text-xs font-mono">what's on your mind?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono text-text-secondary block mb-1">what do I call you?</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Anonymous"
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-green-bright/60 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-text-secondary block mb-1">where you at?</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Lagos, Nigeria"
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-green-bright/60 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-text-secondary block mb-1">type</label>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`text-xs font-mono px-3 py-1.5 rounded border transition-all ${
                  form.type === t
                    ? 'text-green-bright border-green-bright bg-green-dim/20'
                    : 'text-text-secondary border-border hover:border-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-text-secondary block mb-1">
            message <span className="text-red-accent">*</span>
          </label>
          <textarea
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={280}
            rows={3}
            placeholder="say whatever, I'll read it..."
            className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-green-bright/60 outline-none transition-colors resize-none"
          />
          <p className="text-xs text-text-secondary text-right mt-0.5">{form.message.length}/280</p>
        </div>

        {sendError && <p className="text-red-accent text-xs font-mono">{sendError}</p>}

        <button
          type="submit"
          disabled={sending || !form.message.trim()}
          className="w-full py-2.5 rounded font-mono text-sm border border-green-bright/60 text-green-bright hover:bg-green-dim/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {sending ? 'sending...' : '$ git commit -m "send"'}
        </button>

        <AnimatePresence>
          {success && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-green-bright text-xs font-mono text-center"
            >
              ✓ got it, thanks for showing up
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Feed */}
      <div className="space-y-3">
        {loading && <p className="text-text-secondary font-mono text-sm animate-pulse">fetching the wall...</p>}
        {!loading && all.length === 0 && (
          <p className="text-text-secondary font-mono text-sm">wall's empty rn. be the first.</p>
        )}
        {all.map((m, i) => <MessageCard key={m.id ?? `new-${i}`} msg={m} />)}
      </div>
    </div>
  )
}
