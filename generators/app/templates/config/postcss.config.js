'use strict';

module.exports = {
  exec: true, //css in js
  plugins: {
    //   'postcss-cssnext':{},
    'autoprefixer': {
      browsers: 'Safari > 5'
    },
    // 'cssnano':{},
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propList: [
        'font-size'
      ],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  },
};
