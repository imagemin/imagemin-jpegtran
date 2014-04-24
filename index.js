'use strict';

var ExecBuffer = require('exec-buffer');
var imageType = require('image-type');
var jpegtran = require('jpegtran-bin').path;

/**
 * jpegtran image-min plugin
 *
 * @param {Object} opts
 * @api public
 */

module.exports = function (opts) {
    opts = opts || {};

    return function (file, imagemin, cb) {
        if (imageType(file.contents) !== 'jpg') {
            return cb();
        }

        var args = ['-copy', 'none', '-optimize'];
        var exec = new ExecBuffer();

        if (opts.progressive) {
            args.push('-progressive');
        }

        exec
            .use(jpegtran, args.concat(['-outfile', exec.dest(), exec.src()]))
            .run(file.contents, function (err, buf) {
                if (err) {
                    return cb(err);
                }

                file.contents = buf;
                cb();
            });
    };
};
