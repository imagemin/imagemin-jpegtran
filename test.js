const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const isJpg = require('is-jpg');
const isProgressive = require('is-progressive');
const test = require('ava');
const m = require('.');

const readFile = promisify(fs.readFile);

test('optimize a JPG', async t => {
	const buf = await readFile(path.join(__dirname, 'fixture.jpg'));
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isJpg(data));
});

test('throw error when a JPG is corrupt', async t => {
	const buf = await readFile(path.join(__dirname, 'fixture-corrupt.jpg'));
	await t.throwsAsync(async () => {
		await m()(buf);
	}, {message: /Corrupt JPEG data/});
});

test('progressive option', async t => {
	const buf = await readFile(path.join(__dirname, 'fixture.jpg'));
	const data = await m({progressive: true})(buf);
	t.true(isProgressive.buffer(data));
});
