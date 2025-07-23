/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      theme: {
        screens: {
          sm: '393px',
          md: '430px',
        },
      },
      colors: {
        nav: {
          active: '#A8A8A8',
          deactivated: '#A7A7A7',
          stroke: '#EFEFEF',
        },
        subtle: {
          bg: '#F6F6F6',
          text: '#808080',
          border: '#D8D8D8',
        },
        text: {
          base: '#000000',
          emphasis: '#F50000',
          inverse: '#FFFFFF',
        },
        base: {
          bg: '#FFFFFF',
          border: '#EAEAEA',
        },
        brand: {
          primary: '#FFD633',
          accent: '#FFBC00',
        },
      },
    },
    plugins: [],
  },
}
