'use strict';
var fs = require('fs');
var path = require('path');
var isJpg = require('is-jpg');
var pify = require('pify');
var test = require('ava');
var imageminJpegtran = require('../');
var fsP = pify(fs);

test('optimize a JPG', function (t) {
	t.plan(2);

	fsP.readFile(path.join(__dirname, 'fixtures/test.jpg')).then(function (buf) {
		imageminJpegtran()(buf).then(function (data) {
			t.assert(data.length < buf.length, data.length);
			t.assert(isJpg(data));
		});
	});
});

test('throw error when a JPG is corrupt', function (t) {
	t.plan(2);

	fsP.readFile(path.join(__dirname, 'fixtures/test-corrupt.jpg')).then(function (buf) {
		imageminJpegtran()(buf).catch(function (err) {
			t.assert(err, err);
			t.assert(/Corrupt JPEG data/.test(err.message), err.message);
		});
	});
});
