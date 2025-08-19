/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dotaBg: '#0e141b',
        dotaCard: '#111827',
        dotaAccent: '#cf3c0f',
        dotaAccentAlt: '#e34d12',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(227,77,18,0.25)'
      }
    },
  },
  plugins: [],
}


