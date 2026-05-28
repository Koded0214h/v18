import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { postMessage } from '../api'

const STORAGE_KEY = 'msg_modal_seen'

export default function MessageModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', message: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setOpen(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    setSending(true)
    try {
      await postMessage({ ...form, type: 'commit' })
      setDone(true)
      setTimeout(dismiss, 1800)
    } catch (ex) {
      const msg = ex?.response?.data?.error || ex?.response?.data?.message || 'something went wrong.'
      setErr(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full max-w-md bg-bg-surface border border-border rounded-lg overflow-hidden"
          >
            {/* header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-xs font-mono text-text-secondary">
                <span className="text-green-bright">●</span> compose.sh
              </span>
              <button
                onClick={dismiss}
                className="text-text-secondary hover:text-text-primary text-xs font-mono transition-colors"
              >
                [skip]
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div>
                <p className="text-text-primary font-mono text-sm leading-snug">
                  yo, drop a message before you explore 👋
                </p>
                <p className="text-text-secondary font-mono text-xs mt-1">
                  you found this place — say something.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4 text-center"
                  >
                    <p className="text-green-bright font-mono text-sm glow-green">
                      ✓ message committed. thanks.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-3"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="your name (optional)"
                      className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-green-bright/60 outline-none transition-colors"
                    />
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      maxLength={280}
                      rows={3}
                      placeholder="what's on your mind..."
                      className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-green-bright/60 outline-none transition-colors resize-none"
                    />

                    {err && <p className="text-red-accent text-xs font-mono">{err}</p>}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={sending || !form.message.trim()}
                        className="flex-1 py-2 rounded font-mono text-sm border border-green-bright/60 text-green-bright hover:bg-green-dim/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        {sending ? 'sending...' : '$ git commit -m "send"'}
                      </button>
                      <button
                        type="button"
                        onClick={dismiss}
                        className="px-4 py-2 rounded font-mono text-sm border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary transition-all"
                      >
                        skip
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
