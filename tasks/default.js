'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    header,
    content,
    footer;

header = '\nSocial-network task-runner tool CLI.\n\n' +
    gutil.colors.underline('Usage') + '\n  gulp <command>\n\n' +
    'The most commonly used task are:';

content = {
    'soy': 'Compile soy templates',
    'watch': 'Watch for any changes',
    'docs': 'Build docs',
    'build': 'Build AlloyUI & YUI3 using Shifter',
    'format': 'Format SCSS & JavaScript',
    'lint': 'Lint JavaScript code using JSHint',
    'report': 'Open code coverage report',
    'test': 'Run unit tests',
};

function help(callback) {
    var output = '',
        spacing = 0,
        methods;

    methods = Object.keys(content).sort(function (a, b) {
        return a.localeCompare(b);
    });

    methods.forEach(function(item) {
        if (spacing < item.length) {
            spacing = item.length + 3;
        }
    });

    methods.forEach(function(item) {
        output += '  ' + gutil.colors.cyan(item) +
            new Array(spacing - item.length + 1).join(' ') +
            content[item] + '\n';
    });

    if (header) {
        output = header + '\n' + output;
    }

    if (footer) {
        output += '\n' + footer;
    }

    console.log(output);
    callback();
}

gulp.task('default', help);
gulp.task('help', help);
