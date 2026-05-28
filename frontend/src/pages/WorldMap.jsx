import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { useApi } from '../hooks/useApi'
import { getPins, postPin } from '../api'
import SectionHeader from '../components/SectionHeader'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function WorldMap() {
  const { data: pins, loading } = useApi(getPins)
  const [form, setForm]         = useState({ name: '', location: '', latitude: '', longitude: '' })
  const [sending, setSending]   = useState(false)
  const [added, setAdded]       = useState([])
  const [error, setError]       = useState('')
  const [hovered, setHovered]   = useState(null)

  const allPins = [...added, ...(pins || [])]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const lat = parseFloat(form.latitude)
    const lon = parseFloat(form.longitude)
    if (isNaN(lat) || isNaN(lon)) { setError('Enter valid coordinates.'); return }
    setSending(true)
    try {
      const result = await postPin({ ...form, latitude: lat, longitude: lon })
      setAdded((a) => [result, ...a])
      setForm({ name: '', location: '', latitude: '', longitude: '' })
    } catch (err) {
      setError(err?.response?.data?.latitude?.[0] || err?.response?.data?.longitude?.[0] || 'Could not drop pin.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SectionHeader sub={`${allPins.length} people showed up from around the world`}>who's out there</SectionHeader>

      {/* Map */}
      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden mb-8" style={{ height: 420 }}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-text-secondary font-mono text-sm animate-pulse">plotting coordinates...</p>
          </div>
        ) : (
          <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: '100%', height: '100%' }}>
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1a1a1a"
                      stroke="#2a2a2a"
                      strokeWidth={0.5}
                      style={{ default: { outline: 'none' }, hover: { fill: '#222', outline: 'none' }, pressed: { outline: 'none' } }}
                    />
                  ))
                }
              </Geographies>

              {allPins.map((pin, i) => (
                <Marker
                  key={pin.id ?? `new-${i}`}
                  coordinates={[pin.longitude, pin.latitude]}
                  onMouseEnter={() => setHovered(pin)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <motion.circle
                    r={pin.name?.includes('@koded') ? 5 : 4}
                    fill={pin.name?.includes('@koded') ? '#00FF41' : '#58A6FF'}
                    stroke={pin.name?.includes('@koded') ? '#00FF41' : '#58A6FF'}
                    strokeWidth={1}
                    opacity={0.85}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ cursor: 'pointer' }}
                  />
                  {pin.name?.includes('@koded') && (
                    <motion.circle r={8} fill="none" stroke="#00FF41" strokeWidth={1} opacity={0.4}
                      animate={{ r: [8, 14, 8], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 terminal-border pl-3 py-2 text-xs font-mono text-green-bright"
          >
            {hovered.name || 'Anonymous'} · {hovered.location || `${hovered.latitude?.toFixed(2)}, ${hovered.longitude?.toFixed(2)}`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop a pin form */}
      <form onSubmit={handleSubmit} className="bg-bg-surface border border-border rounded-lg p-5 space-y-4">
        <p className="text-text-secondary text-xs font-mono">where are you?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'name', placeholder: 'what do I call you?' },
            { key: 'location', placeholder: 'your city, your country' },
            { key: 'latitude', placeholder: 'latitude (e.g. 6.52)' },
            { key: 'longitude', placeholder: 'longitude (e.g. 3.37)' },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full bg-bg-elevated border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:border-green-bright/60 outline-none transition-colors"
            />
          ))}
        </div>
        <p className="text-text-secondary text-xs font-mono">
          find your coords at{' '}
          <span className="text-blue-accent">maps.google.com</span> → right-click anywhere → copy
        </p>
        {error && <p className="text-red-accent text-xs font-mono">{error}</p>}
        <button
          type="submit"
          disabled={sending}
          className="py-2.5 px-6 rounded font-mono text-sm border border-green-bright/60 text-green-bright hover:bg-green-dim/20 disabled:opacity-40 transition-all"
        >
          {sending ? 'marking the map...' : '$ mark my spot'}
        </button>
      </form>
    </div>
  )
}
