import { listLength } from '../../lib/helpers.js'

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('concat', function (...args) {
    return args.reduce((acc, current) => {
      return typeof current !== 'object'
        ? `${acc}${current}`
        : acc
    }, '')
  })

  Handlebars.registerHelper('listHasLess', (value, max = -1) => {
    const parsedMax = parseInt(max)
    if (parsedMax < 0) return true

    const length = listLength(value)

    return length > -1 && length < parsedMax
  })

  Handlebars.registerHelper('listHasMore', (value, min = -1) => {
    const parsedMin = parseInt(min)
    if (parsedMin < 0) return true

    const length = listLength(value)

    return length > -1 && length < parsedMin
  })

  Handlebars.registerHelper({
    '??': (a, b) => a ?? b,
    and: (a, b) => a && b,
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    ne: (a, b) => a !== b,
    not: a => !a,
    or: (a, b) => a || b,
    ternary: (conditional, a, b) => conditional ? a : b
  })
}
