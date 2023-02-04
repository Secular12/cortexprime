import gulp from 'gulp'
import gulpSass from 'gulp-sass'
import prefix from 'gulp-autoprefixer'
import sass from 'sass'

const SCSS_DEST = './css'
const SCSS_SRC = 'scss/cortexprime.scss'
const SCSS_WATCH = ['scss/**/*.scss']

const prefixOptions = {
  cascade: false
}

const scssOptions = {
  outputStyle: 'expanded'
}

const scss = gulpSass(sass)

export const compile = () => {
  return gulp.src(SCSS_SRC)
    .pipe(
      scss(scssOptions)
        .on('error', handleError)
    )
    .pipe(prefix(prefixOptions))
    .pipe(gulp.dest(SCSS_DEST))
}

function handleError (err) {
  console.log(error.toString())
  this.emit('end')
}

export const watchUpdates = () => {
  gulp.watch(SCSS_WATCH, compile)
}