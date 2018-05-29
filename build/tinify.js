const tinify = require('tinify');
const current = require('../config').current;
const fs = require('fs');
const path = require('path');

const log = console.log.bind(this);

tinify.key = 'iKv5Dl23i-8VwI8crloyZ1BeE7-GhfKy';

const currentPath = path.resolve(__dirname, `../dist/${current}/static/img`);
const distPath = path.resolve(__dirname, `../dist/${current}/static/tinified`);
fs.mkdirSync(distPath, err => log(err));

fs.readdir(currentPath, (err, files) => {
	log(err, files);
	files.forEach(img => {
		const source = tinify.fromFile(`${currentPath}/${img}`);
		source.toFile(`${distPath}/${img}`);
	});
});
