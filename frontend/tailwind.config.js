/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        bg: {
          primary: '#0A0A0A',
          surface: '#111111',
          elevated: '#1A1A1A',
        },
        border: '#2A2A2A',
        text: {
          primary: '#F0F0F0',
          secondary: '#888888',
        },
        green: {
          bright: '#00FF41',
          mid: '#39D353',
          dim: '#0E4429',
        },
        blue: { accent: '#58A6FF' },
        yellow: { accent: '#E3B341' },
        red: { accent: '#F85149' },
        purple: { accent: '#BC8CFF' },
        orange: { accent: '#D29922' },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        glowPulse: {
          '0%,100%': { textShadow: '0 0 8px #00FF41, 0 0 20px #00FF41' },
          '50%': { textShadow: '0 0 4px #00FF41' },
        },
      },
      boxShadow: {
        terminal: '0 0 20px rgba(0, 255, 65, 0.15)',
        card: '0 0 0 1px #2A2A2A',
      },
    },
  },
  plugins: [],
}
