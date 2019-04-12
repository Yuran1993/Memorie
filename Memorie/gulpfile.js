/* eslint-disable */
'use strict';

var gulp = require('gulp');

var sass = require('gulp-sass');
sass.compiler = require('node-sass');

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');

gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('rollup', function() {
  return rollup('rollup.config.js')
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist'));
});

// gulp.task('start', ['copyHtml', 'sass', 'rollup']);

gulp.task('sass:watch', function () {
  gulp.watch('./scss/*.scss', ['sass']);
});
