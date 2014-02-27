var gulp = require('gulp');
var browserify = require('gulp-browserify');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var rename = require('gulp-rename');

var paths = {
  client: {
    main: 'client/app/main.js',
    scripts: 'client/app/**/*.js'
  }
};

gulp.task('scripts', function() {
  return gulp.src(paths.client.main)
    .pipe(browserify({
      debug: true,
    }))
    .pipe(rename('client.js'))
    .pipe(gulp.dest('client/public/dist'));
});

gulp.task('less', function () {
  return gulp.src('client/less/client.less')
    .pipe(less({
      paths: ['client/less']
    }))
    .pipe(gulp.dest('client/public/dist'));
});

gulp.task('watch', function () {
  gulp.watch(paths.client.scripts, ['scripts']);
  gulp.watch('client/less/**/*.less', ['less']);
});

gulp.task('server', function () {
  nodemon({
    script: 'server/server.js',
    options: '--ignore client/'
  });
});

gulp.task('default', ['scripts', 'less', 'watch', 'server']);
// gulp.task('default', ['scripts', 'less', 'watch', 'server']);
