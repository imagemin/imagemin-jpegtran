'use strict';

var isJpg = require('is-jpg');
var jpegtran = require('jpegtran-bin').path;
var spawn = require('child_process').spawn;

/**
 * jpegtran image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
	opts = opts || {};

	return function (file, imagemin, cb) {
		if (!isJpg(file.contents)) {
			cb();
			return;
		}

		var args = ['-copy', 'none', '-optimize'];
		var ret = [];
		var len = 0;

		if (opts.progressive) {
			args.push('-progressive');
		}

		var cp = spawn(jpegtran, args);

		cp.on('error', function (err) {
			cb(err);
			return;
		});

		cp.stderr.setEncoding('utf8');
		cp.stderr.on('data', function (data) {
			cb(data);
			return;
		});

		cp.stdout.on('data', function (data) {
			ret.push(data);
			len += data.length;
		});

		cp.on('close', function () {
			file.contents = Buffer.concat(ret, len);
			cb();
		});

		cp.stdin.end(file.contents);
	};
};
