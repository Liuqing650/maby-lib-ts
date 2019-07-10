const path = require('path');
const chalk = require('chalk');

module.exports = function(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development';
  const isDev = nodeEnv !== 'production';
  const ASSET_PATH = env.ASSET_PATH || '/';
  const PREVIEW = env.PREVIEW === 'true';
  const configPath = './lib/createWebpackConfig';
  const createWebpackConfig = require(configPath);
  const { webpackPlugins, webpackLoaders, outFileName, entryName, optimization, libraryName, library, resolve } = createWebpackConfig(env);
  const outputPath = PREVIEW ? path.join(process.cwd(), 'preview') : path.join(process.cwd(), 'dist');
  
  console.log(chalk.cyanBright(isDev ? `development: ${libraryName} is starting...` : `production: ${libraryName}${env.MINI === 'true' ? '.min' : ''} is building.`));
  // 环境
  const PORT_ENV = env.PORT || 10123;
  return {
    mode: nodeEnv,
    cache: isDev,
    profile: isDev, // 是否捕捉 Webpack 构建的性能信息
    context: path.resolve(process.cwd()),
    entry: entryName,
    devtool: isDev ? 'source-map' : false,
    output: {
      path: outputPath,
      publicPath: ASSET_PATH,
      filename: outFileName,
      pathinfo: isDev,
      library: library,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    devServer: {
      contentBase: path.join(process.cwd(), "dist"),
      overlay: true,
      hot: true,
      headers: {
        'access-control-allow-origin': '*',
      },
      port: PORT_ENV,
      stats: {
        modules: false,
        colors: true
      }
    },
    plugins: webpackPlugins,
    optimization: optimization,
    module: {
      rules: webpackLoaders
    },
    resolve: resolve
  }
};
