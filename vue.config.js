const path = require('path');
const PrerenderSpaPlugin = require('@dreysolano/prerender-spa-plugin');
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;
const beautify = require('js-beautify').html_beautify;
const webpack = require('webpack');

const argv = require('yargs').argv;
const projectName = argv.project || '';
// console.log('-----projectName-------', projectName);

// Auto generate the routes of PrerenderSpaPlugin. Feel free to remove and write it by yourself.
const fs = require('fs');
const routesFile = path.resolve(__dirname, 'prerender-routes/routes.js');
const routes = fs.existsSync(routesFile)
  ? require(routesFile)
  : { allRoutes: ['/'], projectRoutes: {} };
const theRoutes = routes.projectRoutes[projectName] || routes.allRoutes;

const production = process.env.NODE_ENV === 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.project': JSON.stringify(projectName)
  }),
];
if (production) {
  plugins.push(
    // https://github.com/dreysolano/prerender-spa-plugin#readme
    new PrerenderSpaPlugin({
      staticDir: path.join(__dirname, 'dist'),
      // prerender routes
      routes: theRoutes,
      postProcess(renderedRoute) {
        // format
        renderedRoute.html = beautify(renderedRoute.html, { indent_size: 2 });

        return renderedRoute
      },
      renderer: new Renderer({
        headless: true,
        renderAfterDocumentEvent: 'render-event'
      })
    })
  )
}

module.exports = {
  outputDir: 'dist',
  productionSourceMap: !production,
  configureWebpack: {
    plugins
  },
};
