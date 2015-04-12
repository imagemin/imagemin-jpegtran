'use strict';

var path = require('path');
var bufferEqual = require('buffer-equal');
var isJpg = require('is-jpg');
var read = require('vinyl-file').read;
var test = require('ava');
var vinylSmallestJpeg = require('vinyl-smallest-jpeg');
var imageminJpegtran = require('../');

test('optimize a JPG', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test.jpg'), function (err, file) {
		t.assert(!err, err);

		var stream = imageminJpegtran()();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.assert(data.contents.length < size, data.contents.length);
			t.assert(isJpg(data.contents));
		});

		stream.on('error', function (err) {
			t.assert(!err, err);
		});

		stream.end(file);
	});
});

test('skip optimizing an already optimized JPG', function (t) {
	t.plan(1);

	var file = vinylSmallestJpeg();
	var stream = imageminJpegtran()();

	stream.on('data', function (data) {
		t.assert(bufferEqual(data.contents, file.contents));
	});

	stream.on('error', function (err) {
		t.assert(!err, err);
	});

	stream.end(file);
});

test('throw error when a JPG is corrupt', function (t) {
	t.plan(4);

	read(path.join(__dirname, 'fixtures/test-corrupt.jpg'), function (err, file) {
		t.assert(!err, err);

		var stream = imageminJpegtran()();

		stream.on('error', function (err) {
			t.assert(err, err);
			t.assert(path.basename(err.fileName) === 'test-corrupt.jpg', err.fileName);
			t.assert(/Corrupt/.test(err.message), err.message);
		});

		stream.end(file);
	});
});
