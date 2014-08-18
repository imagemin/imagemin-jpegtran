/*global describe, it */
'use strict';

var assert = require('assert');
var fs = require('fs');
var Imagemin = require('imagemin');
var jpegtran = require('../');
var path = require('path');

describe('jpegtran()', function () {
	it('should optimize a JPG', function (cb) {
		var imagemin = new Imagemin();

		imagemin
			.src(path.join(__dirname, 'fixtures/test.jpg'))
			.use(jpegtran())
			.optimize(function (err, file) {
				assert(!err);
				assert(file.contents.length < fs.statSync(imagemin.src()).size);
				assert(file.contents.length > 0);
				cb();
			});
	});
});
