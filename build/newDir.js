const fs = require('fs');
const path = require('path');
const prompt = require('prompt');

function resolve(src) {
	return path.resolve(__dirname, src);
}
/**
 * 复制小文件
 * @param  {[type]} src  [复制源文件路径]
 * @param  {[type]} dist [复制目标路径]
 * @return {[type]}      [description]
 */
function copyFile(src, dist) {
	fs.writeFileSync(dist, fs.readFileSync(src));
}

/**
 * 递归复制文件夹
 * @param  {[type]}   src      要复制的目录
 * @param  {[type]}   dist     复制到目标目录
 * @param  {Function} callback err回调
 * @return {[type]}            [description]
 */
function copyDir(src, dist, callback) {
	// 目标目录不存在时创建目录
	fs.access(dist, function(err) {
		if (err) {
			fs.mkdirSync(dist);
		}
		_copy(null, src, dist);
	});

	function _copy(err, src, dist) {
		if (err) {
			callback(err);
		} else {
			fs.readdir(src, function(err, paths) {
				if (err) {
					callback(err);
				} else {
					paths.forEach(path => {
						const _src = src + '/' + path;
						const _dist = dist + '/' + path;

						fs.stat(_src, (err, stat) => {
							if (err) {
								callback(err);
							} else {
								// 判断是目录还是文件夹
								if (stat.isFile()) {
									copyFile(_src, _dist);
								} else {
									copyDir(_src, _dist, callback);
								}
							}
						});
					});
				}
			});
		}
	}
}

const schema = {
	properties: {
		dirName: {
			required: true,
			type: 'string',
			description: '输入新建的页面名称：'
		},
		author: {
			required: true,
			type: 'string',
			description: '输入作者名：'
		},
		setCurrent: {
			required: true,
			type: 'boolean',
			default: true,
			description: '是否设为默认启动页？输入false或f取消'
		}
	}
};

prompt.start();

prompt.get(schema, function(err, { dirName, author, setCurrent }) {
	if (err) {
		return onErr(err);
	}
	console.log('Command-line input received:');
	console.log('  Username: ' + dirName);

	if (dirName && author) {
		copyDir(resolve('template'), resolve('../src/' + dirName));

		const pageConfigPath = path.resolve(
			__dirname,
			'../config/pageConfig.json'
		);

		fs.readFile(pageConfigPath, 'utf8', (err, data) => {
			if (err) {
				console.log(err);
			} else {
				const obj = JSON.parse(data); //now it an object
				obj.pages.push({
					dirName,
					author
				}); //add some data
				if (setCurrent) {
					obj.current = dirName;
				}
				const json = JSON.stringify(obj, null, 4); //convert it back to json
				fs.writeFile(pageConfigPath, json, 'utf8', err => {
					if (err) {
						console.log(err);
					}
				}); // write it back
			}
		});
	}
});

function onErr(err) {
	console.log(err);
	return 1;
}
