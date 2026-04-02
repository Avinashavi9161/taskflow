/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        glass: {
          white: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.12)',
          hover: 'rgba(255,255,255,0.10)',
        },
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(252,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(226,84%,60%,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(280,100%,76%,0.1) 0px, transparent 50%)',
      },
      backdropBlur: {
        xs: '4px',
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
        glow: '0 0 24px rgba(99,102,241,0.4)',
        'glow-sm': '0 0 12px rgba(99,102,241,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
