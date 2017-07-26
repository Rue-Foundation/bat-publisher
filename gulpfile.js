var gulp = require('gulp')
var del = require('del')
var runSequence = require('run-sequence')
var standard = require('gulp-standard')
var run = require('gulp-run')

var SRC = [
  'index.js', 'dump*.js', 'categories/*.js', 'gulpfile.js', 'rules/*.js'
]

/**
 * Runs travis tests and the pre-commit hook.
 */
var failOnLint = false
gulp.task('angry-lint', function (cb) {
  failOnLint = true
  runSequence(['build-rules', 'lint'], cb)
})

/**
 * Runs linters on all javascript files found in the src dir.
 */
gulp.task('lint', function () {
  // Note: To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failOnError last.
  return gulp.src(SRC)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: failOnLint
    }))
})

/**
 * Build rule set from categories
 */
gulp.task('build-rules', function () {
  return run('npm run build-rules').exec()
})

/**
 * Install pre-commit hook for app.
 */
gulp.task('pre-commit', function () {
  return gulp.src(['./pre-commit'])
    .pipe(gulp.dest('.git/hooks/'))
})

/**
 * The default task when `gulp` is run.
 * Adds a listener which will re-build on a file save.
 */
gulp.task('default', function () {
  runSequence('lint', 'run')
})

/**
 * Cleans all created files by this gulpfile, and node_modules.
 */
gulp.task('clean', function (cb) {
  del([
    'node_modules/'
  ], cb)
})
