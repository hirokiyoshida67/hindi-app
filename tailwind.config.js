/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#1a1f2e',
          800: '#2a3142',
          700: '#3a4456',
        },
        paper: {
          50: '#fbf8f3',
          100: '#f5f0e6',
          200: '#ebe3d3',
        },
        saffron: {
          400: '#f5a25d',
          500: '#e8843a',
          600: '#c66a26',
        },
        indigo_dye: {
          500: '#4a5a8a',
          600: '#3a4a78',
          700: '#2d3a5e',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
