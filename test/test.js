'use strict';

var isJpg = require('is-jpg');
var jpegtran = require('../');
var path = require('path');
var read = require('vinyl-file').read;
var test = require('ava');

test('optimize a JPG', function (t) {
	t.plan(3);

	read(path.join(__dirname, 'fixtures/test.jpg'), function (err, file) {
		t.assert(!err);

		var stream = jpegtran();
		var size = file.contents.length;

		stream.on('data', function (data) {
			t.assert(data.contents.length < size);
			t.assert(isJpg(data.contents));
		});

		stream.end(file);
	});
});
