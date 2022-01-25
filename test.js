import {promisify} from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import isJpg from 'is-jpg';
import isProgressive from 'is-progressive';
import test from 'ava';
import m from './index.js';

const readFile = promisify(fs.readFile);

test('optimize a JPG', async t => {
	const buf = await readFile(path.resolve('fixture.jpg'));
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isJpg(data));
});

test('throw error when a JPG is corrupt', async t => {
	const buf = await readFile(path.resolve('fixture-corrupt.jpg'));
	await t.throwsAsync(async () => {
		await m()(buf);
	}, {message: /Corrupt JPEG data/});
});

test('progressive option', async t => {
	const buf = await readFile(path.resolve('fixture.jpg'));
	const data = await m({progressive: true})(buf);
	t.true(isProgressive.buffer(data));
});
