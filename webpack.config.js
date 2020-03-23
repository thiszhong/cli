const path = require('path');
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

console.log(process.argv);

var getHtmlConfig = function (name, chunks) {
  return {
      template: `./src/pages/${name}/index.html`,
      filename: `${name}.html`,
      // favicon: './favicon.ico',
      // title: title,
      inject: true,
      hash: true, //开启hash  ?[hash]
      chunks: chunks,//页面要引入的包
      minify: process.env.NODE_ENV === "development" ? false : {
          removeComments: false, //移除HTML中的注释
          collapseWhitespace: false, //折叠空白区域 也就是压缩代码
          removeAttributeQuotes: true, //去除属性引用
      },
  };
};
//配置页面
const htmlArray = [{
      _html: 'index',
      title: '首页',
      chunks: ['vendor', 'index']//页面用到的vendor模块
  },
  {
      _html: 'login',
      title: '登录',
      chunks: ['vendor', 'login']
  },
];
//自动生成html模板
const htmlPlugins = htmlArray.map(item => {
  return new HtmlWebpackPlugin(getHtmlConfig(item._html, item.chunks));
})

module.exports = {
  entry: {
		// 多入口文件
    index: ['./src/pages/index/index.js',],
    login: './src/pages/login/index.js',
	},
	output: {
		path:path.resolve(__dirname, 'dist'),
		// 打包多出口文件
		// 生成 a.bundle.js  b.bundle.js  jquery.bundle.js
		filename: './js/[name].bundle.js'
  },
  stats: { children: false }, // 减少琐碎的打印
  devtool: devMode ? 'inline-source-map' : '',
  devServer: {
    contentBase: './dist',
    publicPath: devMode ? '/' : './',
    open: true, // 开启自定打开浏览器
    hot: true // 热更新
  },
  plugins: [
    new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: false}),
    new CopyWebpackPlugin([{
			from: path.resolve(__dirname, 'src/assets'),
			to: './assets'
		}]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,  { nodir: true }),
    }),
    ...htmlPlugins,
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          // test: /\.js$/,
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial", //表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
          name: "vendor", //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
          enforce: true,
        }
      }
    }
  },
  //项目里配置了自动提取node_modules里用到的模块如jquery，也可以在原模板里面通过第三方cdn引入，又是另一种配置了。在 webpack.base.conf.js利配置externals后webpack就不会去打包配置模块
  externals: {
    'jquery': 'window.jQuery'
  },
  module: {
    rules: [
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
  }
};