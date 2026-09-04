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
        robyn: {
          bg: '#000000',
          surface: '#05070A',
          surface2: '#0B0E14',
          surface3: '#121722',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          green: '#00C805',
          'green-bright': '#00E806',
          'green-dim': 'rgba(0, 200, 5, 0.12)',
          'green-border': 'rgba(0, 200, 5, 0.3)',
          muted: '#8B949E',
          mutedLight: '#C9D1D9',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
