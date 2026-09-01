/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      colors: {
        accent: {
          DEFAULT: 'oklch(0.58 0.16 271)',
          50:  'oklch(0.95 0.03 271)',
          100: 'oklch(0.88 0.06 271)',
          200: 'oklch(0.78 0.10 271)',
          300: 'oklch(0.68 0.13 271)',
          400: 'oklch(0.63 0.15 271)',
          500: 'oklch(0.58 0.16 271)',
          600: 'oklch(0.52 0.15 271)',
          700: 'oklch(0.44 0.13 271)',
          800: 'oklch(0.36 0.10 271)',
          900: 'oklch(0.28 0.07 271)',
        },
        surface: {
          DEFAULT: 'oklch(0.16 0.01 260)',
          50:  'oklch(0.98 0.00 260)',
          100: 'oklch(0.90 0.01 260)',
          200: 'oklch(0.75 0.01 260)',
          300: 'oklch(0.58 0.01 260)',
          400: 'oklch(0.42 0.01 260)',
          500: 'oklch(0.30 0.01 260)',
          600: 'oklch(0.24 0.01 260)',
          700: 'oklch(0.20 0.01 260)',
          800: 'oklch(0.16 0.01 260)',
          900: 'oklch(0.12 0.01 260)',
          950: 'oklch(0.08 0.01 260)',
        },
      },
      boxShadow: {
        none: 'none',
      },
      boxShadowColor: {
        none: 'transparent',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
    },
  },
  plugins: [],
};
