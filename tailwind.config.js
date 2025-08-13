// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FFD633',
          accent: '#FFBC00',
        },
        base: {
          bg: '#FFFFFF',
          border: '#EAEAEA',
        },
        subtle: {
          bg: '#F6F6F6',
          border: '#D8D8D8',
          text: '#808080',
        },
        nav: {
          stroke: '#EFEFEF',
          active: '#3A3A3A',
          deactivated: '#A7A7A7',
        },
        text: {
          base: '#000000',
          inverse: '#FFFFFF',
          emphasis: '#F50000',
        },
      },
      spacing: {
        'btn-lg-w': '22.06rem', // 353px
        'btn-md-w': '10.56rem', // 169px
        'btn-sm-w': '8.75rem', // 140px
        'btn-h': '3rem', // 48px
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '5px 5px 10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
