/**
 * webpack配置文件
*/

import webpack from 'webpack';
import path from 'path';

export default ({
  entry: path.join(__dirname, 'build', 'quickDom.js'),

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].min.js'
  },

  resolve: {
    extensions: ['.js']
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warning: false
      }
    })
  ]
});
