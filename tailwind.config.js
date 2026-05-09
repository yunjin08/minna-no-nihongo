/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0a0f0d',
        surface: '#0f1614',
        surface2: '#131c19',
        ink: '#e7f0ec',
        muted: '#7a8a85',
        line: 'rgba(255,255,255,0.08)',
        accent: '#00d68f',
        accent2: '#5cffd0',
        warn: '#ffb454',
        danger: '#ff5c8a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        script: ['"Caveat"', '"Dancing Script"', 'cursive'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 32px -4px rgba(0,214,143,0.45)',
        glowSoft: '0 0 24px -8px rgba(0,214,143,0.35)',
        glowStrong: '0 0 60px -8px rgba(0,214,143,0.55)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(60% 60% at 50% 0%, rgba(0,214,143,0.18) 0%, transparent 70%)',
        'card-glow':
          'radial-gradient(120% 120% at 0% 0%, rgba(92,255,208,0.10) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 32px -4px rgba(0,214,143,0.4)' },
          '50%': { boxShadow: '0 0 60px -4px rgba(0,214,143,0.8)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
