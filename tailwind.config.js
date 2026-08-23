/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cnu-blue': {
          DEFAULT: '#0B3D91',
          50: '#eff4ff',
          100: '#dbe6ff',
          200: '#b3c8ff',
          300: '#7a9ef0',
          400: '#3d6fd4',
          500: '#1c4fb8',
          600: '#0B3D91',
          700: '#093278',
          800: '#07265c',
          900: '#051b42',
        },
        'cnu-gold': '#F7D117',
        'cnu-dark': '#1f2937',
        'cnu-light': '#f8fafc',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
