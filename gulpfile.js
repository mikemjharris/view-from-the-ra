var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('./public/stylesheets/style.scss')
    .pipe(sass())
    .on('error', onError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/dist/'));
});

gulp.task('js', function () {
  gulp.src([
    './public/javascripts/main.js',
  ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('./public/dist/'));
});

gulp.task('watch', ['sass', 'js'], function () {
  gulp.watch('./public/stylesheets/*', ['sass']);
  gulp.watch('./public/javascripts/*', ['js']);
});

function onError( err ) {
  console.log('Error!!', err);
  this.emit('end');
}
