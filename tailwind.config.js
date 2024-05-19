import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        flip: 'flip 1.2s ease-out forwards',
        unflip: 'unflip 1.2s ease-out forwards',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        unflip: {
          '0%': { transform: 'rotateY(360deg)' },
          '100%': { transform: 'rotateY(0)' },
        },
      },
    },
  },
  plugins: [
    forms,
  ],
}

