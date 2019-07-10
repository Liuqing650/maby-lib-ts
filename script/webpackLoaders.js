const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 获取loaders
const webpackLoaders = ({isDev, eslint, options}) => {
  const userLoaders = options.loaders;
  let loaders = [
    {
      test: /\.(jsx|tsx|js|ts)?$/,
      exclude: /node_modules/,
      loader: 'awesome-typescript-loader',
    },
    {
      enforce: 'pre',
      test: /\.(jsx|tsx|js|ts)?$/,
      exclude: /node_modules/,
      loader: 'source-map-loader'
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use:['typings-for-css-modules-loader', 'postcss-loader']
      })
    },
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      })
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }
      ]
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    }
  ];

  if (eslint) {
    loaders.unshift({
      test: /\.(jsx|tsx|js|ts)?$/,
      enforce: 'pre',
      exclude: /node_modules/,
      loader: 'tslint-loader'
    });
  }
  if (userLoaders) {
    if (typeof userLoaders === 'function') {
      return userLoaders(loaders);
    } else if (typeof userLoaders === 'object') {
      if (Array.isArray(userLoaders)) {
        loaders = loaders.concat(userLoaders);
      } else if (Object.keys(userLoaders).length > 0) {
        Object.keys(userLoaders).map((key) => {
          loaders.push(userLoaders[key]);
        });
      }
    }
  }
  return loaders;
};
module.exports = webpackLoaders;
