
process.env.BABEL_ENV = 'production'


var fs = require('fs');
var zlib = require('zlib')
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var version = process.env.VERSION || require('../package.json').version
var banner =
    "/*!\n" +
    " * vue-timelinepick v" + version + "\n" +
    ' * (c) ' + new Date().getFullYear() + ' yelingfeng\n' +
    " * https://github.com/yelingfeng/vue-timelinepick\n" +
    " * Released under the MIT License.\n" +
    " */\n";

rollup.rollup({
  entry: 'src/index.js',
  sourceMap: true,
  plugins: [babel()]
})
.then(function (bundle) {
  var code = bundle.generate({
    format: 'cjs',
    banner: banner,
    moduleName: 'VueTimelinepick'
  }).code
  return write('dist/vue-timelinepick.js', code).then(function() {
    return code
  })
})
.then(function (code) {
  var minified = banner + '\n' + uglify.minify(code, {
    fromString: true,
    output: {
      ascii_only: true
    }
  }).code
  return write('dist/vue-timelinepick.min.js', minified)
})
.then(function () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/vue-timelinepick.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/vue-timelinepick.min.js.gz', buf).then(resolve)
      })
    })
  })
})
.catch(logError);



function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
