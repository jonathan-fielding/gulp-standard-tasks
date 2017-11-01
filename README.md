# gulp-standard-tasks

`gulp-standard-tasks` is an opinionated set of tasks that can be registered with `gulp` to quickly enable building of static assets. Aside from building static assets it also bundles Browsersync to enable auto reloading of the browser when changes have been made to the page or assets.

* [Installation](#installation)
* [Usage](#usage)
	- [Clean](#clean)
	- [Copy](#copy)	 
	- [CSS](#css)
	- [SVG](#svg)
	- [JavaScript](#javascript)
	- [Jekyll](#jekyll)
	- [Browsersync](#browsersync)
* [Contributing](#contributing)
* [Licence](#licence)

## Installation

To install `gulp-standard-tasks` install it from npm using

```
npm install gulp-standard-tasks --save-dev
```

## Usage

To use `gulp-standard-tasks` register the tasks you want to use using `gulp`. Instructions on how to do this for each task follow.

### Clean

The `clean` task is used to remove a directory and its contents. This is typically used before regenerating your assets so you can ensure the folder your assets are built to does not contain any legacy assets.

#### Options

To use the `clean` task, register it with `gulp.task` passing the folder to be deleted as a parameter.

#### Example usage

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('clean-images', tasks.clean('./_site/images/**/*'));
```

### Copy

The `copy` task enables you to copy assets from one location to another.

#### Options

The `copy` task accepts an object with the following properties:

* `src`  Standard `gulp` src expression specifying files to be copied
* `dest` Destination directory

#### Example usage:

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('docs-image-copy', ['clean-images'], tasks.copy({
	src: './docs/images/**/*',
	dest: './.site/images'
}));

```

### CSS

The `css` task enables you to compile Sass to CSS. It takes an opinionated approach to building Sass by taking advantage of the following gulp plugins to optimise for browser support and file size.

* gulp-sass
* gulp-rename
* gulp-combine-media-queries
* gulp-autoprefixer
* gulp-csso

#### Options

The `css` task accepts an object with the following properties:

* `src`  Standard `gulp` src expression
* `dest` Destination directory,
* `mode` Development (dev) or Production (prod) mode
* `autoprefixer` Autoprefixer browser expression for what you want to support, **default value** 'last 3 versions'
* `csso` Enable csso CSS optimisation **default value** true (prod mode), false (dev mode)
* `sourcemaps` Enable sourcemaps **default value** true (dev mode), false (prod mode)
* `browserSync` Enable Browsersync **default value** false
* `rename` Object to be passed to gulp-rename - see [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) for available options

#### Example usage:

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('sass-dev', tasks.css({
	src: 'docs/_scss/docs.scss',
	dest: 'docs/css'
}));

gulp.task('sass-prod', tasks.css({
	src: 'docs/_scss/docs.scss',
	dest: 'docs/css',
	mode: 'prod'
}));
```

### SVG

Reusable task for compiling SVG into spritesheets

#### Options

The `svg` task accepts an object with the following properties:

* `src`  Standard `gulp` src expression
* `dest` Destination directory,
* `prefix` A prefix the svg filenames will use when referenced in the spritesheet **default value** 'icon-',
* `removeFill` Option to remove the fill of the SVG so it can be styled using CSS **default value** false

#### Example usage:

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('svg-icons', tasks.svg({
    src: 'src/svg/icons/*.svg',
    dest: 'dist/images',
    removeFill: true
}));
```

### JavaScript

Reusable task for compiling JavaScript using browserify

#### Options

The `browserify` task accepts an object with the following properties:

* `src`  Standard `gulp` src expression
* `dest` Destination directory,
* `bundleName` Name of the bundle to be built inside the destination folder
* `mode` Development (dev) or Production (prod) mode **default value** dev
* `watch` Should watchify be enabled for this build (watches files and rebuilds on changes) **default value** false
* `minify` Should JavaScript be minified using uglify **default value** true (prod mode), false (dev mode)
* `fullPaths` Should Browserify include the full paths to the modules it has included (needed for tools such as discify that do deep package inspection) **default value** true (dev mode), false (prod mode)

#### Example usage:

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('browserify', tasks.browserify({
    src: 'docs/scripts/docs.js',
    dest: '.site/scripts',
    bundleName: 'docs-bundle.min.js'
}));

```

### Jekyll

To use the Jekyll builder you will need to have first installed the Jekyll Ruby Gem. This task will wrap the Ruby Gem to enable Jeyll builds to be controlled by Gulp.

#### Example usage:

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('jekyll-build', tasks.jekyll.build);

```

### Browsersync

A Browsersync instance is exposed by gulp-standard-tasks so that this instance can be shared between tasks.

#### Options

`gulp-standard-tasks` exposes an instance of Browsersync. This means any of the functionality documented on the [Browsersync website](https://www.browsersync.io/) can be used when using this module.

#### Example usage:

This example shows how you might use Browsersync in conjunction with Jekyll to reload the content after Jekyll has rebuilt the page.

```
const gulp = require('gulp');
const tasks = require('gulp-standard-tasks')(gulp);

gulp.task('serve', ['jekyll-build'], function() {
    tasks.browserSync({
        server: {
            baseDir: '.site'
        }
    });
});


gulp.task('jekyll-build', tasks.jekyll.build);
gulp.task('jekyll-rebuild', ['jekyll-build'], () => tasks.browserSync.reload());

```

## Release Log

### 2.0.1 - 1st November 2017
Upgraded all the dependencies so that `gulp-standard-tasks` would be compatible with Node 8. As many of the dependencies had Major version changes it made sense to do this as a breaking change to indicate this.


## Contributing

gulp-standard-tasks is maintained by Beamly and is closed to outside contributions.

## Licence

gulp-standard-tasks is licensed under the Apache 2.0 license.
