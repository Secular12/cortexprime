const reduceOp = (args, reducer) => {
  args = Array.from(args)
  args.pop() // => options
  var first = args.shift()
  return args.reduce(reducer, first)
}


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

  Handlebars.registerHelper('hasLess', (val, max = -1) => {
    const parsedMax = parseInt(max)

    if (val === null || val === undefined) return false

    if (parsedMax < 0) return true

    return val.hasOwnProperty('length')
      ? val.length < parsedMax
      : typeof val === 'object'
        ? Object.keys(val).length < parsedMax
        : val < parsedMax
  })

  Handlebars.registerHelper('hasMore', (val, min = 0) => {
    const parsedMin = parseInt(min)

    if (parsedMin === 0 || val === null || val === undefined) return true

    return val.hasOwnProperty('length')
      ? val.length > parsedMin
      : typeof val === 'object'
        ? Object.keys(val).length > parsedMin
        : val > parsedMin
  })

  Handlebars.registerHelper('ifString', function (val, str, alt) {
    return val ? str : alt
  })

  Handlebars.registerHelper('existsOr', (a, b) => {
    return a || b
  })
  Handlebars.registerHelper({
    eq: function () { return reduceOp(arguments, (a, b) => a === b) },
    ne: function () { return reduceOp(arguments, (a, b) => a !== b) },
    lt: function () { return reduceOp(arguments, (a, b) => a < b) },
    gt: function () { return reduceOp(arguments, (a, b) => a > b) },
    lte: function () { return reduceOp(arguments, (a, b) => parseInt(a) <= parseInt(b)) },
    gte: function () { return reduceOp(arguments, (a, b) => parseInt(a) >= parseInt(b)) },
    and: function () { return reduceOp(arguments, (a, b) => a && b) },
    or: function () { return reduceOp(arguments, (a, b) => a || b) },
    not: a => !a
  });
}
