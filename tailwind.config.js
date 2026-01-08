/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      padding: {
        // Essencial para apps mobile (Safe Areas)
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      colors: {
        brand: {
          primary: '#0052FF', // Azul padrão esportivo
          secondary: '#00C2FF',
        }
      }
    },
  },
  plugins: [],
}