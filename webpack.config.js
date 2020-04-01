const path = require('path');
var requireContext = require('require-context');

const plugins = require('./webpack.plugin');
const rules = require('./webpack.rule');

const devMode = process.env.NODE_ENV !== 'production';
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  // 根据 src/pages 下文件名自动动态生成入口文件
  // 后期需要可以 自定义打包参数 打包指定目录/项目
  entry: () => {
    const obj = {};
    const entryFiles = requireContext(path.resolve(__dirname, './src/pages'), true, /index\.js$/);
    entryFiles.keys().forEach(a => {
      const arr = a.split('/')
      // >1时 */login/index.html这种 取login
      const name = arr.length > 1 ? arr[arr.length - 2] : arr[arr.length - 1].split('.')[0];
      obj[name] = path.resolve(__dirname, './src/pages', a)
    })
    console.log(obj);
    return obj;
  },
  output: {
    hashDigestLength: 8,
    path: outputPath,
    filename: './js/[name].[hash].js'
  },
  stats: { children: false }, // 减少琐碎的打印
  devtool: devMode ? 'inline-source-map' : '',
  devServer: {
    contentBase: outputPath,
    publicPath: devMode ? '/' : './',
    open: true, // 开启自定打开浏览器
    hot: true // 热更新
  },
  plugins: plugins,
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
    rules: rules
  }
}