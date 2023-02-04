import gulp from 'gulp'

import * as css from './utils/css.mjs'
import * as js from './utils/js.mjs'

// CSS Compiling
export const buildCss = gulp.series(css.compile)
export const watchCss = gulp.series(
  gulp.parallel(css.compile),
  css.watchUpdates
)

// Javascript compiling & linting
export const buildJs = gulp.series(js.compile)
export const lint = gulp.series(js.lint)

// Compiling All
export const buildAll = gulp.parallel(
  css.compile,
  js.compile
)

export default watchCss
