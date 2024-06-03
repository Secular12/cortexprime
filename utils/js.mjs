import eslint from 'gulp-eslint7'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import mergeStream from 'merge-stream'
import nodeResolve from '@rollup/plugin-node-resolve'
import { rollup, } from 'rollup'
import yargs from 'yargs'

const LINTING_PATHS = ['./index.mjs', 'system/',]

const bundleWriteOptions = {
  file: 'cortexprime.mjs',
  format: 'es',
  sourcemap: 'true',
  sourcemapFile: 'index.mjs',
}

const parsedArgs = yargs(process.argv).argv

const rollupOptions = {
  input: './index.mjs',
  plugins: [nodeResolve(),],
}

export const compile = async () => {
  const bundle = await rollup(rollupOptions)

  await bundle.write(bundleWriteOptions)
}

const getEslintOptions = () => ({
  fix: !!parsedArgs.fix,
})

export const lint = () => {

  const tasks = LINTING_PATHS.map(path => {
    const src = path.endsWith('/') ? `${path}**/*.js` : path
    const dest = path.endsWith('/') ? path : `${path.split('/').slice(0, -1).join('/')}/`

    return gulp
      .src(src)
      .pipe(eslint(getEslintOptions()))
      .pipe(eslint.format())
      .pipe(gulpIf(file => file.eslint != null && file.eslint.fixed, gulp.dest(dest)))
  })

  return mergeStream(tasks)
}
