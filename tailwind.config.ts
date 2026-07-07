import type { Config } from 'tailwindcss'

/**
 * TMK Fitness brand tokens.
 * Colors, fonts and spacing pulled from the gym's real brand identity.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#075586', // deep blue
          light: '#0a6ba8',
          dark: '#053f63',
        },
        secondary: {
          DEFAULT: '#222d35', // dark navy — header / dark sections
          light: '#2e3b45',
        },
        accent: {
          teal: '#449abb',
          pink: '#ce7fb6',
        },
      },
      fontFamily: {
        heading: ['Rajdhani', 'system-ui', 'sans-serif'],
        body: ['Ubuntu', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 14px -4px rgba(7, 85, 134, 0.18)',
        sheet: '0 -8px 30px -8px rgba(34, 45, 53, 0.35)',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
