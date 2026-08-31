/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171512',
        parchment: '#F4EDDD',
        emerald: '#0E3B2E',
        emeraldDeep: '#082821',
        gold: '#C69A45',
        goldSoft: '#E4C688',
        maroon: '#6B1F2A',
      },
      fontFamily: {
        display: ['Amiri', 'serif'],
        body: ['Tajawal', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        arch: '260px 260px 8px 8px',
      },
    },
  },
  plugins: [],
};
