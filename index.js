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
		'-optimize'
	];

	if (opts.progressive) {
		args.splice(0, 0, '-progressive');
	}

	if (opts.arithmetic) {
		args.splice(0, 0, '-arithmetic');
	}

	args.push('-outfile', execBuffer.output, execBuffer.input);

	return execBuffer({
		input: buf,
		bin: jpegtran,
		args
	}).catch(err => {
		err.message = err.stderr || err.message;
		throw err;
	});
};
