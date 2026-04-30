/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/ideas/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['Martian Mono', 'monospace']
      },
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#222222',
        accent: '#e8ff00',
        accent2: '#ff3c3c',
        muted: '#555'
      }
    }
  },
  plugins: []
}