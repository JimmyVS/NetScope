/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'mono': ['Source Code Pro', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: {
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
          to: {
            textShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
          },
        },
      },
    },
  },
  plugins: [],
};