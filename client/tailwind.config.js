/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cream/parchment background from screenshots
        cream: {
          50: '#FCF8F1',
          100: '#FAF3E8',
          200: '#F4E9D7',
        },
        // Forest green primary
        forest: {
          50: '#EAF1EC',
          100: '#C9DAD0',
          400: '#3F6B52',
          500: '#2D5340',
          600: '#1F3D2C',
          700: '#162E21',
          800: '#0E1F16',
        },
        // Soft peach accent panels
        blush: {
          100: '#FDEEDF',
          200: '#FBE5D6',
          300: '#F6D1B7',
        },
        // Warm earth dark for footer
        earth: {
          900: '#1A1815',
          800: '#26221E',
          700: '#3A332C',
        },
        gold: {
          400: '#D8B26A',
          500: '#C99B4D',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 24px -8px rgba(31, 61, 44, 0.12)',
      },
      letterSpacing: {
        'wider-2': '0.18em',
      },
    },
  },
  plugins: [],
};
