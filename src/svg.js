'use strict';

const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const gulpif = require('gulp-if');

module.exports = ({
    src = null,
    dest = null,
    prefix = 'icon-',
    removeFill = false,
    spriteName = 'sprite.svg',
    scssPath = '_sprite.scss'
}) => {
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
                    dest: `./`,
                    layout: 'diagonal',
                    sprite: `${dest}/${spriteName}`,
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
                mapname: 'icons'
            }
        }))
        .pipe(gulp.dest(process.cwd()));
    };
};