export const addListeners = ($html, selector, event, callback) => {
  $html
    .querySelectorAll(selector)
    .forEach($item => {
      $item.addEventListener(event, callback)
    })
}

export const camelCasetoKebabCase = (str) => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
     ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
     : letter;
  }).join('');
}

export const displayToggleMethod = function (event, $target) {
  const $toggler = $target ?? event.currentTarget

  const $chevronIcon = $toggler.querySelector('.fa')
  const { parent, target } = $toggler.dataset

  $chevronIcon
    .classList
    .toggle('fa-chevron-down')

  $chevronIcon
    .classList
    .toggle('fa-chevron-up')

  $toggler
    .closest(parent)
    ?.querySelector(target)
    .classList
    .toggle('hide')
}

export const displayToggle = ($html) => {
  addListeners(
    $html,
    '.display-toggle',
    'click',
    displayToggleMethod
  )
}

export const isObject = value => (
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value)
)

export const localizer = target => game.i18n.localize(target)

export const objectToArray = obj => {
  return Object.entries(obj)
    .reduce((arr, [key, value]) => {
      arr[key] = value
      return arr
    }, [])
}

export const objectSortToArray = (obj, cb) => {
  const entries = Object.entries(obj)

  const callback = cb
    ? cb
    : ([a], [b]) => b > a ? -1 : a > b ? 1 : 0

  entries.sort((a, b) => callback(a, b, entries.length))

  return entries
    .map(([_, value]) => value)
}

const rounding = (dir = null) => (number, increment, offset) => {
  const roundingDir = dir ?? 'round'
  if (!increment) return number

  const incSplit = increment.toString().split('.')

  const precision = incSplit.length > 1 ? incSplit[1].length : null
  const value = Math[roundingDir]((number - offset) / increment ) * increment + offset
  
  return precision ? parseFloat(value.toPrecision(precision)) : value
}

export const round = rounding()

export const uuid = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  })
}
