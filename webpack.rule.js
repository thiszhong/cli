const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    test: /\.(css|less|scss|sass)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: false,
          publicPath: "../",
          hmr: process.env.NODE_ENV === 'development',
        }
      },
      "css-loader", "less-loader", "sass-loader", "postcss-loader"
    ]
  },
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader'
    },
    // 不检查node_modules下的js文件
    exclude: "/node_modules/"
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'file-loader'
    ]
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      'file-loader'
    ]
  }
]