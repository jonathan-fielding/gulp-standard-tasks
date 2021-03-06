'use strict';

const gulp = require('gulp');
const rev = require('gulp-rev');
const revCssUrls = require('gulp-rev-css-url');
const gulpGzip = require('gulp-gzip');
const gulpif = require('gulp-if');

module.exports = ({
    src = null,
    dest = null,
    manifest = null,
    gzip = false
}) => {
    return () => {
        return gulp.src(src)
            .pipe(rev())
            .pipe(revCssUrls())
            .pipe(gulpif(gzip, gulpGzip({ append: false })))
            .pipe(gulp.dest(dest))
            .pipe(rev.manifest())
            .pipe(gulp.dest(manifest));
    };
};