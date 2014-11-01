'use strict';

var gulp = require('gulp');

// you can make it faster by running tasks in parallel
// see npm module run-sequence for more info
// but only do it if performance is your bootleneck
// and never forget to measure the results.
gulp.task('build', ['soynode', 'soynode-lang', 'sass']);
