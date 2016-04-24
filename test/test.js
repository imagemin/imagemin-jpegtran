import fs from 'fs';
import path from 'path';
import isJpg from 'is-jpg';
import pify from 'pify';
import test from 'ava';
import m from '../';

const fsP = pify(fs);

test('optimize a JPG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures/test.jpg'));
	const data = await m()(buf);
	t.true(data.length < buf.length);
	t.true(isJpg(data));
});

test('throw error when a JPG is corrupt', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures/test-corrupt.jpg'));
	t.throws(m()(buf), /Corrupt JPEG data/);
});
