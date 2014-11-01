'use strict';

var path = require('path'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
    var src = path.resolve('./src/public/styles'),
        dest = path.resolve('./dist/styles'),
        config;

    config = {
        errLogToConsole: false
    };

    return gulp.src(src + '/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(config))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
});
