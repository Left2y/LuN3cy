/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"OPPO Sans"', 'Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#666666',
        bg: '#ffffff',
        line: '#e5e5e5',
      },
      boxShadow: {
        'pill': '0 4px 20px rgba(0,0,0,0.05)',
        'pill-dark': '0 4px 20px rgba(255,255,255,0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'liquid': 'liquid 3s ease infinite',
        'hourglass-flip': 'hourglassFlip 4s cubic-bezier(0.6, 0.05, 0.1, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        liquid: {
          '0%': { 'background-size': '200% 200%', 'background-position': '0% 50%' },
          '50%': { 'background-size': '200% 200%', 'background-position': '100% 50%' },
          '100%': { 'background-size': '200% 200%', 'background-position': '0% 50%' },
        },
        hourglassFlip: {
          '0%, 80%': { transform: 'rotate(0deg)' }, /* Pause for sand to fall */
          '90%, 100%': { transform: 'rotate(180deg)' } /* Quick Flip */
        }
      }
    }
  },
  plugins: [],
}
