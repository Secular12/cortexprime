import { getLength, objectFindValue } from '../../lib/helpers.js'
import { getBorderWidth } from '../scripts/foundryHelpers.js'

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('borderPosition', (borderPosition, borderWidth) => {
    return getBorderWidth(borderPosition, borderWidth)
  })

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

    const length = getLength(value)

    return length > -1 && length < parsedMax
  })

  Handlebars.registerHelper('listHasMore', (value, min = -1) => {
    const parsedMin = parseInt(min)
    if (parsedMin < 0) return true

    const length = getLength(value)

    return length > -1 && length > parsedMin
  })

  Handlebars.registerHelper('viewClasses', (value, breadcrumbs = {}) => {
    const activeBreadcrumb = objectFindValue(breadcrumbs, breadcrumb => breadcrumb.active)

    return (activeBreadcrumb?.target || null) === value ? 'view' : 'view hide'
  })

  Handlebars.registerHelper({
    '??': (a, b) => a ?? b,
    and: (a, b) => a && b,
    eq: (a, b) => a === b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    mod: (a, b) => a % b,
    minus: (a, b) => (+a) - (+b),
    ne: (a, b) => a !== b,
    not: a => !a,
    or: (a, b) => a || b,
    plus: (a, b) => +a + b,
    ternary: (conditional, a, b) => conditional ? a : b
  })
}
