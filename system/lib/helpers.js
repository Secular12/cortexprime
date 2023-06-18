export const displayToggleMethod = function (event) {
  const $toggler = $(this)
  const $chevronIcon = $toggler.find('.fa')
  const { parent, target } = event.currentTarget.dataset

  $chevronIcon.toggleClass('fa-chevron-down fa-chevron-up')
  $toggler.closest(parent).find(target).toggleClass('hide')
}

export const displayToggle = (html) => {
  html
    .find('.display-toggle')
    .click(displayToggleMethod)
}

export const isObject = value => (
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value)
)

export const objectToArray = obj => {
  return Object.entries(obj)
    .reduce((arr, [key, value]) => {
      arr[key] = value
      return arr
    }, [])
}

export const localizer = target => game.i18n.localize(target)

const rounding = (dir = null) => (number, increment, offset) => {
  const roundingDir = dir ?? 'round'
  if (!increment) return number

  const incSplit = increment.toString().split('.')

  const precision = incSplit.length > 1 ? incSplit[1].length : null
  const value = Math[roundingDir]((number - offset) / increment ) * increment + offset
  
  return precision ? parseFloat(value.toPrecision(precision)) : value
}

export const round = rounding()

export const camelCasetoKebabCase = (str) => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
     ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
     : letter;
  }).join('');
}
