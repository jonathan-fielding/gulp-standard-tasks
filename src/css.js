'use strict';

const gulp = require('gulp');
const gulpSourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const gulpRename = require('gulp-rename');
const gulpif = require('gulp-if');
const nodeBrowserSync = require('browser-sync');
const autoprefixerPostCSS = require('autoprefixer');
const mqpackerPostCSS = require("css-mqpacker");
const cssoPostCSS = require("postcss-csso");

function onError(err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
}

module.exports = ({
    src = 'src',
    dest = 'dest',
    mode = 'dev',
    exitOnError = false,
    autoprefixer = 'last 3 versions',
    csso = null,
    sourcemaps = null,
    browserSync = false,
    rename = {},
    customSassOptions = {}
}) => {
    const sourcemapsEnabled = (mode === 'dev' && sourcemaps !== false) || sourcemaps === true;
    const cssoEnabled = (mode === 'prod' && csso !== false) || csso === true;

    let processors = [
        autoprefixerPostCSS({browsers: [autoprefixer]}),
        mqpackerPostCSS()
    ];

    if (cssoEnabled) {
        processors.push(cssoPostCSS())
    }

    return () => {
        nodeBrowserSync.notify('Sass building');

        return gulp.src(src)
        .pipe(gulpif(exitOnError === false, plumber({
            errorHandler: onError
        })))
        .pipe(gulpif(sourcemapsEnabled, gulpSourcemaps.init()))
        .pipe(sass(customSassOptions))
        .pipe(postcss(processors))
        .pipe(gulpif(sourcemapsEnabled, gulpSourcemaps.write('.')))
        .pipe(gulpif(browserSync, nodeBrowserSync.reload({
            stream: true
        })))
        .pipe(gulpRename(rename))
        .pipe(gulp.dest(dest));
    };
};
