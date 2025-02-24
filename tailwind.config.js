/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#32FF9F', // Lime Green
          hover: '#2ce68f',
        },
        secondary: {
          DEFAULT: '#2AC4FF', // Sky Blue
          hover: '#1eb3eb',
        },
        dark: {
          DEFAULT: '#121417', // Deep navy/dark gray
          lighter: '#1a1e23', // Slightly lighter
          card: '#1f242b', // Card background
          teal: '#0F2E2E', // Dark teal overlay
        },
        text: {
          light: '#E0E0E0', // Light gray for body text
          muted: '#9CA3AF', // Muted text
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(50, 255, 159, 0.3)', // Green glow
        'glow-blue': '0 0 15px rgba(42, 196, 255, 0.3)', // Blue glow
        'glow-strong': '0 0 20px rgba(50, 255, 159, 0.5)', // Stronger green glow
        'glow-blue-strong': '0 0 20px rgba(42, 196, 255, 0.5)', // Stronger blue glow
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #32FF9F, #2AC4FF)',
        'gradient-text': 'linear-gradient(135deg, #E0E0E0, #FFFFFF)',
        'gradient-border': 'linear-gradient(135deg, rgba(50, 255, 159, 0.5), rgba(42, 196, 255, 0.5))',
      },
      animation: {
        'border-flow': 'border-flow 3s ease infinite',
        'pulse': 'pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 2.6s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'border-flow': {
          '0%, 100%': { borderColor: 'rgba(50, 255, 159, 0.5)' },
          '50%': { borderColor: 'rgba(42, 196, 255, 0.5)' },
        },
        'pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
        'ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
      }
    },
  },
  plugins: [],
}