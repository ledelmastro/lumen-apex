/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    "./src/**/*.{html,ts}", // Monitora todos os arquivos HTML e TypeScript na pasta src
  ],
  theme: {
    extend: {
      colors: {
        'lumen-blue': '#0f172a',
        'lumen-gold': '#fbbf24',
        slate: {
          950: '#0f172a',
          900: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}