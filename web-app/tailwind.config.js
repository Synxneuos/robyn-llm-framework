/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        robinhood: {
          green: '#00C805',
          'green-bright': '#00E806',
          'green-muted': '#00C80520',
          dark: '#000000',
          card: '#0D0E11',
          surface: '#14161A',
          border: '#23272F',
        },
        green: {
          400: '#00E806',
          500: '#00C805',
          600: '#00A304',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
