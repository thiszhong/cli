const path = require('path');
const glob = require('glob')
var requireContext = require('require-context');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

var getHtmlConfig = function (name, thePath, chunks) {
  return {
    // 后期需要可以 自定义打包参数 打包指定目录/项目
    template: `./src/pages/${thePath}`,
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    hash: false, //开启hash  ?[hash]
    chunks: chunks, // 页面要引入的包
    minify: devMode ? false : {
        removeComments: false, //移除HTML中的注释
        collapseWhitespace: false, //折叠空白区域 也就是压缩代码
        removeAttributeQuotes: true, //去除属性引用
    }
  }
};
//配置页面
const htmlArray = (function() {
  const entryFiles = requireContext(path.resolve(__dirname, './src/pages'), true, /index\.html$/);
  
  return entryFiles.keys().map(a => {
    const arr = a.split('/')
    // >1时 */login/index.html这种 取login
    const name = arr.length > 1 ? arr[arr.length - 2] : arr[arr.length - 1].split('.')[0];

    return {
      _html: name,
      path: a,
      chunks: ['vendor', name] // 页面用到的vendor模块
    }
  })
}());

//自动生成html模板
const htmlPlugins = htmlArray.map(item => {
  return new HtmlWebpackPlugin(getHtmlConfig(item._html, item.path, item.chunks));
})

module.exports = [
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
]