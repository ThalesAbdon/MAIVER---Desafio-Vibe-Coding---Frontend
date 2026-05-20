/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0F1419',
        paper: '#FAF8F4',
        accent: '#2D5BFF',
      },
    },
  },
  plugins: [],
}
