'use strict';
const execBuffer = require('exec-buffer');
const isJpg = require('is-jpg');
const jpegtran = require('jpegtran-bin');

module.exports = opts => buf => {
	opts = Object.assign({}, opts);

	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isJpg(buf)) {
		return Promise.resolve(buf);
	}

	const args = [
		'-copy', 'none',
		'-optimize',
		'-outfile', execBuffer.output,
		execBuffer.input
	];

	if (opts.progressive) {
		args.push('-progressive');
	}

	if (opts.arithmetic) {
		args.push('-arithmetic');
	}

	return execBuffer({
		input: buf,
		bin: jpegtran,
		args
	}).catch(err => {
		err.message = err.stderr || err.message;
		throw err;
	});
};
