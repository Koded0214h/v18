import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const COMMANDS = {
  help: () => [
    '  available commands:',
    '  help           — list commands',
    '  whoami         — identity',
    '  ls memories/   — memory categories',
    '  cat /logs/faith— a faith note',
    '  ping future    — receive a signal',
    '  version        — current build',
    '  uptime         — time online',
    '  clear          — clear terminal',
    '  exit           — go back',
  ],
  whoami: () => ['Abdulrahman. Still figuring it out.'],
  'ls memories/': () => [
    'drwxr-xr-x  growth/',
    'drwxr-xr-x  emotional/',
    'drwxr-xr-x  faith/',
    'drwxr-xr-x  difficult/',
    'drwxr-xr-x  experiment/',
    'drwxr-xr-x  basketball/',
    'drwxr-xr-x  productive/',
    `total: 364 days`,
  ],
  'cat /logs/faith': () => [
    '"Indeed, with hardship comes ease." — Quran 94:5',
    '',
    'I made istighfar before every major decision this year.',
    'Not because I was afraid. Because I knew I was not the',
    'author of outcomes — only of effort.',
    '',
    'Tawakkul is not passive. It is the thing you do after',
    'you have done everything in your power.',
  ],
  'ping future': () => {
    const responses = [
      'PING future... 64 bytes from destiny: icmp_seq=1 ttl=18 time=∞ ms',
      'Response: You are on the right path. Keep compiling.',
      'Response: The build will succeed. Patience is part of the stack.',
      'Response: What you are becoming is not visible yet. Ship anyway.',
    ]
    return [responses[Math.floor(Math.random() * responses.length)]]
  },
  version: () => ['koded_os_v18 — build 2026.05.31 — I AM KODED'],
  uptime: () => {
    const now   = new Date()
    const bday  = new Date('2008-05-31')
    const years = Math.floor((now - bday) / (1000 * 60 * 60 * 24 * 365))
    return [`up ${years} years — no scheduled downtime`]
  },
  'sudo reveal_truth': () => [
    'Permission granted.',
    '',
    'The truth: I am not the smartest person in most rooms I enter.',
    'I am usually the most determined.',
    'That has been enough so far.',
  ],
  'meaning_of_life': () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        'loading...',
        'loading...',
        'loading...',
        'Error 418: I\'m a teapot.',
      ]), 2000)
    })
  },
}

export default function Terminal() {
  const [history, setHistory]     = useState([
    { type: 'system', text: 'koded_os_v18 terminal — type "help" to start' },
    { type: 'system', text: 'Konami code got you here. respect.' },
  ])
  const [input, setInput]         = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx, setHistIdx]     = useState(-1)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => { inputRef.current?.focus() }, [])

  async function runCommand(raw) {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    setHistory((h) => [...h, { type: 'input', text: `koded@os:~$ ${raw}` }])
    setCmdHistory((h) => [raw, ...h])
    setHistIdx(-1)

    if (cmd === 'clear') { setHistory([]); return }
    if (cmd === 'exit')  { window.history.back(); return }

    const fn = COMMANDS[cmd]
    if (!fn) {
      setHistory((h) => [...h, { type: 'error', text: `command not found: ${cmd}. try "help"` }])
      return
    }

    const result = fn()
    if (result instanceof Promise) {
      setHistory((h) => [...h, { type: 'output', text: 'processing...' }])
      const lines = await result
      setHistory((h) => [...h.slice(0, -1), ...lines.map((t) => ({ type: 'output', text: t }))])
    } else {
      setHistory((h) => [...h, ...result.map((t) => ({ type: 'output', text: t }))])
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') { runCommand(input); setInput('') }
    if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx] || '')
    }
    if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx] || '')
    }
  }

  return (
    <div
      className="min-h-screen bg-black flex flex-col p-4 md:p-8 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex-1 font-mono text-sm max-w-3xl mx-auto w-full"
      >
        <div className="space-y-1 mb-2">
          {history.map((line, i) => (
            <div
              key={i}
              className={
                line.type === 'input'  ? 'text-green-bright' :
                line.type === 'error'  ? 'text-red-accent' :
                line.type === 'system' ? 'text-text-secondary' :
                'text-text-primary'
              }
            >
              {line.text || ' '}
            </div>
          ))}
        </div>

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-green-bright shrink-0">koded@os:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none text-green-bright caret-green-bright font-mono text-sm"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="animate-blink text-green-bright">█</span>
        </div>

        <div ref={bottomRef} />
      </motion.div>
    </div>
  )
}
