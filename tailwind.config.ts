// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      // Container ayarı (değişiklik yok)
      container: {
        center: true,
        padding: '1rem', 
        screens: {
          '2xl': '1200px',
        },
      },

      // Animasyon kodları (değişiklik yok)
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-up': {
          'from': { opacity: '0', transform: 'translateY(100%)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.3s ease-out forwards',
      },
    },
  },
  
  // Eklenti 'plugins' dizisinden KALDIRILDI.
  plugins: [
    // require('tailwind-scrollbar-hide') <-- BU SATIRI SİLDİK
  ],
}
export default config