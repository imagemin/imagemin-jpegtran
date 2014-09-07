'use strict';

var fs = require('fs');
var Imagemin = require('imagemin');
var isJpg = require('is-jpg');
var jpegtran = require('../');
var path = require('path');
var test = require('ava');

test('should optimize a JPG', function (t) {
	t.plan(4);

	var imagemin = new Imagemin()
		.src(path.join(__dirname, 'fixtures/test.jpg'))
		.use(jpegtran());

	imagemin.optimize(function (err, file) {
		t.assert(!err);

		fs.stat(imagemin.src(), function (err, stats) {
			t.assert(!err);
			t.assert(file.contents.length < stats.size);
			t.assert(isJpg(file.contents));
		});
	});
});

test('should fail when a JPG is corrupt', function (t) {
	t.plan(2);

	var imagemin = new Imagemin()
		.src(path.join(__dirname, 'fixtures/test-corrupt.jpg'))
		.use(jpegtran());
		
	imagemin.optimize(function (err) {
		t.assert(err);
		t.assert(/Corrupt JPEG data/.test(err.message));
	});
});
