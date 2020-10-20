'use strict';
const execBuffer = require('exec-buffer');
const isJpg = require('is-jpg');
const jpegtran = require('jpegtran-bin');

module.exports = options => buf => {
	options = {
		strip: false,
		...options
	};

	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isJpg(buf)) {
		return Promise.resolve(buf);
	}

	const args = [];

	if (options.progressive) {
		args.push('-progressive');
	}

	if (options.grayscale) {
		args.push('-grayscale');
	}

	if (options.strip) {
		args.push('-copy');
		args.push('none');
	} else {
		args.push('-copy');
		args.push('all');
	}

	if (options.arithmetic) {
		args.push('-arithmetic');
	} else {
		args.push('-optimize');
	}

	args.push('-outfile', execBuffer.output, execBuffer.input);

	return execBuffer({
		input: buf,
		bin: jpegtran,
		args
	}).catch(error => {
		error.message = error.stderr || error.message;
		throw error;
	});
};
