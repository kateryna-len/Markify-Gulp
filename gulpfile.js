const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

function scripts() {
  return src('./app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('./app/scss/style.scss')
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('./app/css'))
    .pipe(browserSync.stream());
}

function fonts() {
  return src('./app/fonts/src/*.*')
    .pipe(
      fonter({
        formats: ['woff', 'ttf'],
      })
    )
    .pipe(src('./app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/text'));
}

function images() {
  return src(['./app/image/src/*.*', '!./app/image/src/*.svg'])
    .pipe(newer('./app/image/dist'))
    .pipe(imagemin())
    .pipe(dest('./app/image/dist'));
}

function watching() {
  browserSync.init({
    server: {
      baseDir: './app',
    },
  });
  watch(['./app/js/main.js'], scripts);
  watch(['./app/scss/style.scss'], styles);
  watch(['./app/image/src'], images);
  watch(['./app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('./dist').pipe(clean());
}

function building() {
  return src(
    [
      './app/css/style.min.css',
      './app/js/main.min.js',
      './app/fonts/*.*',
      './app/image/src/*.*',
      './app/**/*.html',
    ],
    { base: 'app' }
  ).pipe(dest('./dist'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, watching);
