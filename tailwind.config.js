/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffbf0',
          100: '#fef5d6',
          200: '#fde9ad',
          300: '#fcd679',
          400: '#fabf45',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        celebration: {
          purple: '#6d28d9',
          plum: '#4c1d95',
          pink: '#db2777',
          rose: '#e11d48',
          cream: '#fffdfa',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        cursive: ['"Great Vibes"', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        sway: 'sway 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite linear',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
