var gulp = require('gulp');
var browserify = require('gulp-browserify');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');

var paths = {
  scripts: ['client/src/js/**/*.js'],
  less: ['client/src/less/**/*.less']
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(browserify({
      debug:true
    }))
    .pipe(gulp.dest('client/build/js'));
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(gulp.dest('client/build/css'));
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts', 'less']);
});

gulp.task('server', function () {
  nodemon({
    script: 'bin/jekyll-ui.js',
    options: '--ignore client/'
  });
});

gulp.task('default', ['scripts', 'less', 'watch', 'server']);
