/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#f5f5f5',
        accent: '#ff6b35',
        glass: {
          light: 'rgba(255,255,255,0.6)',
          dark: 'rgba(26,26,26,0.6)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem'
      },
      boxShadow: {
        soft: '0 8px 24px rgba(0,0,0,0.06)'
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
