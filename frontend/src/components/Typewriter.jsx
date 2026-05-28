import { useState, useEffect } from 'react'

export default function Typewriter({ lines, onDone, speed = 40, lineDelay = 300 }) {
  const [displayed, setDisplayed] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done || currentLine >= lines.length) return

    const line = lines[currentLine]

    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), speed)
      return () => clearTimeout(t)
    }

    // line finished — pause then move to next
    const t = setTimeout(() => {
      setDisplayed((d) => [...d, line])
      setCurrentLine((l) => l + 1)
      setCurrentChar(0)
    }, lineDelay)
    return () => clearTimeout(t)
  }, [currentLine, currentChar, done, lines, speed, lineDelay])

  useEffect(() => {
    if (currentLine >= lines.length && !done) {
      setDone(true)
      onDone?.()
    }
  }, [currentLine, lines.length, done, onDone])

  const activeLine = currentLine < lines.length ? lines[currentLine].slice(0, currentChar) : ''

  return (
    <div className="font-mono text-sm leading-7">
      {displayed.map((line, i) => (
        <div key={i} className="text-green-bright">
          {line}
        </div>
      ))}
      {!done && (
        <div className="text-green-bright">
          {activeLine}
          <span className="animate-blink">█</span>
        </div>
      )}
    </div>
  )
}
