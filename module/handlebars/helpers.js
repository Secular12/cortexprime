export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('capitalize', str => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  })

  Handlebars.registerHelper('concat', function (...args) {
    return args.reduce((acc, current) => {
      return typeof current !== 'object'
        ? `${acc}${current}`
        : acc
    }, '')
  })

  Handlebars.registerHelper('equalOrBetween', function (val, min, max) {
    const value = val || val === 0 || val === '0'
      ? parseInt(val, 10)
      : false
    return value !== false && value >= parseInt(min, 10) && value <= parseInt(max, 10)
  })

  Handlebars.registerHelper('hasLess', (val, max = -1) => {
    if (parseInt(max) < 0) return true

    return Array.isArray(val) || typeof val === 'string'
      ? val.length < parseInt(max)
      : typeof val === 'object' && val !== null && val !== undefined
        ? Object.keys(val).length < parseInt(max)
        : false
  })

  Handlebars.registerHelper('ifeq', (a, b, options) => {
    if (a == b) { return options.fn(this) }
    return options.inverse(this)
  })

  Handlebars.registerHelper('ifString', function (val, str, alt) {
    return val ? str : alt
  })

  Handlebars.registerHelper('existsOr', (a, b) => {
    return a || b
  })
}
