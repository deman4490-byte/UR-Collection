/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            DEFAULT: '#0B192C',
            deep: '#070F1E',
            surface: '#1E3E62',
            light: '#2E5A88',
            dark: '#050B14'
          },
          orange: {
            DEFAULT: '#FF9900',
            hover: '#E68A00',
            active: '#CC7A00',
            light: '#FFF4E5',
            glow: '#FFA41C',
            accent: '#FA8900'
          },
          slate: {
            subtle: '#F3F4F6',
            card: '#FFFFFF',
            darkCard: '#111827',
            border: '#E5E7EB',
            darkBorder: '#1F2937'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'mobile-tab': '0 -4px 20px -2px rgba(0, 0, 0, 0.08), 0 -2px 6px -1px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 30px -10px rgba(11, 25, 44, 0.12)',
        'glow-orange': '0 4px 20px -2px rgba(255, 153, 0, 0.35)',
        'drawer': '-10px 0 35px -5px rgba(0, 0, 0, 0.25)',
      },
      screens: {
        'xs': '380px',
      },
      padding: {
        'safe-bottom': 'env(safe-area-inset-bottom, 16px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
      }
    },
  },
  plugins: [],
}
