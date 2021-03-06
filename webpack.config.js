const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const banner = `Grid Component v1.0.2
https://sa-si-dev.github.io/grid-component
Licensed under MIT (https://github.com/sa-si-dev/grid-component/blob/master/LICENSE)`;

module.exports = (env, options) => {
  const config = {
    target: 'es5',

    entry: {
      styles: './src/styles.js',
      'grid-core': './src/grid-core.js',
    },

    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist'),
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'grid-core.min.css',
      }),

      new webpack.BannerPlugin(banner),

      new FileManagerPlugin({
        events: {
          onStart: {
            delete: ['dist'],
          },
          onEnd: {
            delete: ['dist/styles.min.js'],
            copy: [
              { source: 'static', destination: 'dist' },
              { source: 'static', destination: 'docs/assets/build' },
              { source: 'dist', destination: 'docs/assets/build' },
            ],
          },
        },
      }),
    ],

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /(node_modules)/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };

  if (options.mode === 'development') {
    config.devtool = 'inline-source-map';
  }

  return config;
};
