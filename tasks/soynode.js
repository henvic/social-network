'use strict';

var path = require('path'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    soynode = require('gulp-soynode'),
    src = path.resolve('./src/views'),
    dest = path.resolve('./dist/templates');

gulp.task('soynode', function() {
    return gulp.src(src + '/*.soy')
        .pipe(plumber())
        .pipe(soynode())
        .pipe(gulp.dest(dest));
});

// for internationalization see
// https://developers.google.com/closure/templates/docs/translation
// https://github.com/Medium/soynode#internationalization
gulp.task('soynode-lang', function() {
    var config = {
        outputFile: dest + '/translations.xlf'
    };

    return gulp.src(src + '/*.soy')
        .pipe(plumber())
        .pipe(soynode.lang(config));
});

gulp.task('soynode-watch', function() {
    gulp.watch('src/views/*.soy', function(file) {
        gulp.src(file.path)
            .pipe(soynode())
            .pipe(gulp.dest(dest));
    });
});
