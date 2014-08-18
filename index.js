'use strict';

var ExecBuffer = require('exec-buffer');
var isJpg = require('is-jpg');
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
        if (!isJpg(file.contents)) {
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
