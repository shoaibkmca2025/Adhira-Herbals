/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCF8EF',
          100: '#FAF4E6',
          200: '#F1E9D6',
          300: '#E8DDC5',
        },
        forest: {
          50: '#EAF1EC',
          100: '#C9DAD0',
          400: '#3F6B52',
          500: '#2D5340',
          600: '#1F3D2C',
          700: '#162E21',
          800: '#0E1F16',
          900: '#0A1810',
        },
        blush: {
          100: '#FDEEDF',
          200: '#FBE5D6',
          300: '#F6D1B7',
        },
        earth: {
          900: '#1A1815',
          800: '#26221E',
          700: '#3A332C',
        },
        gold: {
          400: '#D8B26A',
          500: '#C99B4D',
          600: '#B58938',
        },
        mustard: {
          400: '#D9A84A',
          500: '#C99033',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 24px -8px rgba(31, 61, 44, 0.12)',
        float: '0 20px 50px -20px rgba(22, 46, 33, 0.35)',
      },
      letterSpacing: {
        'wider-2': '0.18em',
        'wider-3': '0.24em',
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #1F3D2C 0%, #2D5340 60%, #3F6B52 100%)',
      },
    },
  },
  plugins: [],
};
