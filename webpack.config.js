const path = require('path');

module.exports = {
  entry: './src/sophCompare.js',
  output: {
    filename: 'sophCompare.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
