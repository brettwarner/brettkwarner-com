'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('default', ['lint', 'mocha']);
gulp.task('lint', function(){
	gulp.src('./src/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});
gulp.task('mocha', function(){
	gulp.src('./test/**/*.js')
	.pipe(mocha({reporter:'nyan'}));
});
