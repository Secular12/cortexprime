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
  return Math[roundingDir]((number - offset) / increment ) * increment + offset
}

export const round = rounding()
