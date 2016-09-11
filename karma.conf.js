var webpackConfig = require('./webpack.config');

// enzyme needs that...
webpackConfig.module.loaders.push({
  test: /\.json$/,
  loader: 'json-loader'
});

require('core-js/es5');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/*.ts',
      'test/*.tsx',
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ts': ['webpack'],
      'test/**/*.tsx': ['webpack'],
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      // needed for enzyme
      externals: {
        cheerio: 'window',
        "react/lib/ExecutionEnvironment": true,
        'react/lib/ReactContext': true,
        'react/addons': true
      },
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
}