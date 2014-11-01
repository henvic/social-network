'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('start', ['build', 'watch'], function start() {
    var config = {
        script: 'index.js',
        ext: 'js scss',
        ignore: []
    };

    nodemon(config)
        .on('restart', function () {
            console.log('restarted!');
        });
});
