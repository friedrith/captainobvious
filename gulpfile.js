const gulp = require('gulp')
const less = require('gulp-less')

gulp.task('watch-less', [ 'less' ], () => {
    gulp.watch('./src/public/styles/*.less', [ 'less' ])  // Watch all the .less files, then run the less task
})

gulp.task('less', () => {
    return gulp.src('./src/public/styles/style.less')
    .pipe(less())
    .pipe(gulp.dest('./src/public/styles/'))
})
