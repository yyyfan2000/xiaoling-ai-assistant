/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        fox: {
          orange: '#FF6B35',
          cream: '#FFF3E0',
          dark: '#E05520',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
