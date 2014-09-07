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

		if (opts.progressive) {
			args.push('-progressive');
		}

		var cp = spawn(jpegtran, args, {stdio: ['pipe', null, null]});
    
		var imageBuffer = [];
		var errorBuffer = [];

		cp.stdout.on('data', function(data) {
			imageBuffer.push(data);
		});

		cp.stderr.on('data', function(data) {
			errorBuffer.push(data);
		});

		cp.on('close', function() {
			if (errorBuffer.length) {
				cb(new Error(Buffer.concat(errorBuffer)));
				return;
			}
  
			file.contents = Buffer.concat(imageBuffer);
			cb();
		});

		cp.stdin.write(file.contents);
		cp.stdin.end();
	}
};
