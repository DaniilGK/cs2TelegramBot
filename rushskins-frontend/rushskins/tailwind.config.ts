import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // RushSkins dark palette — deep gunmetal + electric orange accents
        bg: {
          base:    '#0A0A0C',
          surface: '#111116',
          raised:  '#18181F',
          overlay: '#1F1F28',
        },
        accent: {
          orange: '#FF5C00',
          dim:    '#CC4900',
          glow:   '#FF5C0022',
        },
        gold: {
          DEFAULT: '#C9963A',
          light:   '#E8B84B',
        },
        text: {
          primary:   '#F0EDE8',
          secondary: '#8A8790',
          muted:     '#4A4850',
        },
        border: {
          DEFAULT: '#2A2830',
          bright:  '#3D3B48',
        },
        // rarity colors
        rarity: {
          consumer:     '#9AAFC4',
          industrial:   '#5E97C2',
          milspec:      '#4B69FF',
          restricted:   '#8847FF',
          classified:   '#D32CE6',
          covert:       '#EB4B4B',
          contraband:   '#E4AE33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up':    'slideUp 0.3s ease',
        'fade-in':     'fadeIn 0.25s ease',
        'tap-bounce':  'tapBounce 0.15s ease',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp:   { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        tapBounce: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(0.94)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 12px #FF5C0033' }, '50%': { boxShadow: '0 0 28px #FF5C0066' } },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}

export default config
