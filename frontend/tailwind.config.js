/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        teal: {
          50:  '#e0faf4',
          100: '#b5f5e8',
          200: '#7eecd6',
          300: '#3ddec0',
          400: '#00d4aa',
          500: '#00b893',
          600: '#0d9a9a',
          700: '#0a6e6e',
          800: '#074f4f',
          900: '#033333',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(10,110,110,0.10)',
        btn:  '0 4px 14px rgba(10,110,110,0.30)',
      },
      borderRadius: {
        xl2: '14px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease both',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
