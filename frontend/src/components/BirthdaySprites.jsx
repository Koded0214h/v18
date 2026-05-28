// pixel art birthday critters — 16-unit grid, each unit = 2px
// swap Character for an <img> sprite sheet when you have real assets

const P = 2 // px per grid unit

function Character({ body = '#00FF41', hat = '#F85149', flip = false }) {
  const w = 16 * P
  const h = 22 * P
  return (
    <svg
      width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{ imageRendering: 'pixelated', display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* hat star */}
      <rect x={7*P} y={0}      width={2*P} height={1*P} fill="#FFD700" />
      {/* hat cone */}
      <rect x={6*P} y={1*P}   width={4*P} height={1*P} fill={hat} />
      <rect x={5*P} y={2*P}   width={6*P} height={1*P} fill={hat} />
      {/* hat brim */}
      <rect x={4*P} y={3*P}   width={8*P} height={1*P} fill={hat} />
      {/* head */}
      <rect x={5*P} y={4*P}   width={6*P} height={5*P} fill={body} />
      {/* eyes */}
      <rect x={6*P} y={6*P}   width={1*P} height={1*P} fill="#000" opacity="0.65" />
      <rect x={9*P} y={6*P}   width={1*P} height={1*P} fill="#000" opacity="0.65" />
      {/* smile */}
      <rect x={6*P} y={8*P}   width={4*P} height={1*P} fill="#000" opacity="0.5" />
      {/* cheeks */}
      <rect x={5*P} y={7*P}   width={1*P} height={1*P} fill="#ff9999" opacity="0.4" />
      <rect x={10*P} y={7*P}  width={1*P} height={1*P} fill="#ff9999" opacity="0.4" />
      {/* body */}
      <rect x={5*P} y={9*P}   width={6*P} height={4*P} fill={body} />
      {/* left arm */}
      <rect x={3*P} y={9*P}   width={2*P} height={2*P} fill={body} />
      {/* right arm */}
      <rect x={11*P} y={9*P}  width={2*P} height={2*P} fill={body} />
      {/* left leg */}
      <rect x={5*P} y={13*P}  width={2*P} height={3*P} fill={body} />
      {/* right leg */}
      <rect x={9*P} y={13*P}  width={2*P} height={3*P} fill={body} />
      {/* left foot */}
      <rect x={4*P} y={16*P}  width={3*P} height={2*P} fill={body} />
      {/* right foot */}
      <rect x={9*P} y={16*P}  width={3*P} height={2*P} fill={body} />
      {/* tiny confetti dots scattered around */}
      <rect x={2*P} y={5*P}   width={1*P} height={1*P} fill="#FFD700" opacity="0.8" />
      <rect x={14*P} y={4*P}  width={1*P} height={1*P} fill="#F85149" opacity="0.8" />
      <rect x={1*P} y={9*P}   width={1*P} height={1*P} fill="#BC8CFF" opacity="0.8" />
      <rect x={14*P} y={11*P} width={1*P} height={1*P} fill="#58A6FF" opacity="0.8" />
    </svg>
  )
}

// each critter: walk direction, timing, size, colors
const CRITTERS = [
  { rtl: false, duration: 24, delay: 0,    scale: 2,   body: '#00FF41', hat: '#F85149' },
  { rtl: false, duration: 30, delay: -7,   scale: 1.5, body: '#58A6FF', hat: '#E3B341' },
  { rtl: true,  duration: 20, delay: -14,  scale: 2.4, body: '#BC8CFF', hat: '#39D353' },
  { rtl: false, duration: 26, delay: -3,   scale: 1.8, body: '#E3B341', hat: '#58A6FF' },
  { rtl: true,  duration: 22, delay: -18,  scale: 1.3, body: '#00FF41', hat: '#BC8CFF' },
  { rtl: false, duration: 32, delay: -10,  scale: 2.8, body: '#F85149', hat: '#00FF41' },
]

export default function BirthdaySprites() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 45,
        overflow: 'hidden',
      }}
    >
      {CRITTERS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 52,
            // horizontal walk lives here — no transform conflict
            animation: `${c.rtl ? 'sprite-walk-rtl' : 'sprite-walk-ltr'} ${c.duration}s ${c.delay}s linear infinite`,
          }}
        >
          {/* scale wrapper */}
          <div style={{ transform: `scale(${c.scale})`, transformOrigin: 'bottom left' }}>
            {/* bounce wrapper */}
            <div
              style={{
                animation: `sprite-bounce ${0.35 + i * 0.04}s ease-in-out infinite`,
              }}
            >
              <Character body={c.body} hat={c.hat} flip={c.rtl} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
