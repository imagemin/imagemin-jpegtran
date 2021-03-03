# imagemin-jpegtran ![GitHub Actions Status](https://github.com/imagemin/imagemin-jpegtran/workflows/test/badge.svg?branch=master)

> jpegtran imagemin plugin


## Install

```
$ npm install --save imagemin-jpegtran
```


## Usage

```js
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');

(async () => {
	await imagemin(['images/*.jpg'], {
		destination: 'build/images',
		plugins: [
			imageminJpegtran()
		]
	});

	console.log('Images optimized');
})();
```


## API

### imageminJpegtran([options])(buffer)

Returns a promise for a buffer.

#### options

##### progressive

Type: `boolean`<br>
Default: `false`

Lossless conversion to progressive.

##### arithmetic

Type: `boolean`<br>
Default: `false`

Use [arithmetic coding](http://en.wikipedia.org/wiki/Arithmetic_coding).

#### buffer

Type: `buffer`

Buffer to optimize.


## License

MIT © [imagemin](https://github.com/imagemin)
