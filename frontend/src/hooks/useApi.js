import { useState, useEffect, useRef, useCallback } from 'react'

export function useApi(fn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [tick, setTick]       = useState(0)

  // always call the latest fn, never a stale closure
  const fnRef = useRef(fn)
  useEffect(() => { fnRef.current = fn })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fnRef.current()
      .then((d) => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch((e) => { if (!cancelled) { setError(e); setLoading(false) } })
    return () => { cancelled = true }
  }, [...deps, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => setTick((n) => n + 1), [])

  return { data, loading, error, retry }
}
