/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0EA5E9',
          dark:    '#0284C7',
          light:   '#38BDF8',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          dark:    '#7C3AED',
          light:   '#A78BFA',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(14,165,233,0.3)',
        'glow-secondary': '0 0 30px rgba(139,92,246,0.3)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
        'card-light': '0 4px 24px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
        'gradient-success': 'linear-gradient(135deg, #10B981, #059669)',
        'gradient-danger':  'linear-gradient(135deg, #EF4444, #DC2626)',
      },
    },
  },
  plugins: [],
}
