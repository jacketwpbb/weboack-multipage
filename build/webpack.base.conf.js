'use strict';
const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SpritesmithPlugin = require('webpack-spritesmith');
const isProduction = process.env.NODE_ENV === 'production';
const current = config.current;

//判断是否存在sprite文件夹
//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const plugins = fsExistsSync(resolve(`./src/${current}/sprite`))
  ? [
      new SpritesmithPlugin({
        src: {
          cwd: `./src/${current}/sprite`, //准备合并成sprit的图片存放文件夹
          glob: '*.png' //哪类图片
        },
        target: {
          image: `./src/${current}/sprite-generated/sprite.png`, // sprite图片保存路径
          css: `./src/${current}/sprite-generated/_sprites.scss`
          // 生成的sass保存在哪里
        },
        apiOptions: {
          cssImageRef: 'sprite-generated/sprite.png' //css根据该指引找到sprite图
        }
      })
    ]
  : [];

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: `./src/${current}/index.js`
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src')
    },
    modules: [
      'node_modules',
      `./src/${current}/sprite` //css在哪里能找到sprite图
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.css$/,
        use: isProduction
          ? ExtractTextPlugin.extract(['css-loader', 'postcss-loader'])
          : ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: isProduction
          ? ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'postcss-loader'
                },
                {
                  loader: 'sass-loader'
                }
              ]
            })
          : ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins
};
