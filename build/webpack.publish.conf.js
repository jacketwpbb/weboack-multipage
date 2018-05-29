'use strict';

const merge = require('webpack-merge');
const prodWebpackConfig = require('./webpack.prod.conf');

const config = require('../config');
const keys = require('../config/keys.js');

const tinyPngWebpackPlugin = require('tinypng-webpack-plugin');
// 引入
const QiniuPlugin = require('qn-webpack');

// 配置 Plugin
const qiniuPlugin = new QiniuPlugin({
	accessKey: keys.qn_AccessKey,
	secretKey: keys.qn_SecretKey,
	bucket: 'uoolu',
	path: `webpackUpload/${config.current}/`,
	exclude: /\.html$/
});

const webpackConfig = merge(prodWebpackConfig, {
	output: {
		publicPath: config.publish.assetsPublicPath
	},
	plugins: [
		new tinyPngWebpackPlugin({
			key: keys.tinyPNG, //can be Array, eg:['your key 1','your key 2'....]
			ext: ['png', 'jpeg', 'jpg'] //img ext name
			// proxy:'http://user:pass@192.168.0.1:8080'//http proxy,eg:如果你来自中国，同时拥有shadowsocks，翻墙默认配置为 http:127.0.0.1:1080 即可。（注，该参数因为需要超时断开连接的原因，导致最后会延迟执行一会webpack。但相对于国内网络环境，用此参数还是非常划算的，测试原有两张图片，无此参数耗时2000ms+，有此参数耗时1000ms+节约近半。）
		}),
		qiniuPlugin
	]
});

module.exports = webpackConfig;
