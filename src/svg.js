'use strict';

const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const svgstore = require('gulp-svgstore');
const gulpif = require('gulp-if');
const gulpRename = require('gulp-rename');

module.exports = ({
    mode = null,
    src = null,
    dest = null,
    prefix = 'icon-',
    removeFill = false,
    spriteName = 'sprite',
    scssPath = '_sprite.scss'
}) => {
    if (mode === 'use') {
        return () => gulp.src(src).pipe(cheerio({
            run: ($) => {
                $('[fill]').removeAttr('fill');
            },

            parserOptions: {
                xmlMode: true,
            },
        }))
        .pipe(gulpRename({prefix: prefix}))
        .pipe(svgmin({
            plugins: [{
                cleanupIDs: {
                    prefix: prefix,
                    minify: true,
                },
            }],
        }))
        .pipe(svgstore())
        .pipe(gulpRename(`${spriteName}.svg`))
        .pipe(gulp.dest(dest));
    }
    else {
        return () => {
            return gulp.src(src).pipe(gulpif(removeFill, cheerio({
                run: ($) => {
                    $('[fill]').removeAttr('fill');
                },
                parserOptions: { xmlMode: true }
            })))
            .pipe(svgmin({
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix,
                        minify: true
                    }
                }]
            }))
            .pipe(svgSprite({
                shape: {
                    spacing: {
                        padding: 5
                    }
                },
                mode: {
                    css: {
                        commonName: 'test',
                        dest: `./`,
                        layout: 'diagonal',
                        sprite: `${dest}/${spriteName}.svg`,
                        bust: false,
                        render: {
                            scss: {
                                dest: scssPath,
                                template: `${__dirname}/templates/sprite-template.scss`
                            }
                        }
                    }
                },
                variables: {
                    mapname: spriteName
                }
            }))
            .pipe(gulp.dest(process.cwd()));
        };
    }
};