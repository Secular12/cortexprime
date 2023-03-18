export const diceIcons = {
  d4: (type = 'die-rating', number = 4) => (
    `<div class="cp-die cp-d4 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d4">' +
    '<path class="fill" d="M15 30 30 4H0l15 26z"></path>' +
    '<path class="stroke" d="M26.54 6 15 26 3.46 6h23.08M30 4H0l15 26L30 4z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'),
  d6: (type = 'die-rating', number = 6) => (
    `<div class="cp-die cp-d6 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d6">' +
    '<path class="fill" d="M4 4h22v22H4V4z"></path>' +
    '<path class="stroke" d="M24 6v18H6V6h18m2-2H4v22h22V4z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  ),
  d8: (type = 'die-rating', number = 8) => (
    `<div class="cp-die cp-d8 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d8">' +
    '<path class="fill" d="M1 15 15 1l14 14-14 14L1 15z"></path>' +
    '<path class="stroke" d="M15 3.83 26.17 15 15 26.17 3.83 15 15 3.83M15 1 1 15l14 14 14-14L15 1z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  ),
  d10: (type = 'die-rating', number = 10) => (
    `<div class="cp-die cp-d10 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d10">' +
    '<path class="fill" d="M3 8.07v13.86L15 28l12-6.07V8.07L15 2 3 8.07z"></path>' +
    '<path class="stroke" d="M15 2 3 8.07v13.86L15 28l12-6.07V8.07L15 2zm10 18.7-10 5.06L5 20.7V9.3l10-5.06L25 9.3v11.4z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  ),
  d12: (type = 'die-rating', number = 12) => (
    `<div class="cp-die cp-d12 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d12">' +
    '<path class="fill" d="M27 18.9v-7.8l-4.58-6.31L15 2.38 7.58 4.79 3 11.1v7.8l4.58 6.31L15 27.62l7.42-2.41L27 18.9z"></path>' +
    '<path class="stroke" d="m15 4.48 6.18 2.01L25 11.75v6.5l-3.82 5.26L15 25.52l-6.18-2.01L5 18.25v-6.5l3.82-5.26L15 4.48m0-2.1L7.58 4.79 3 11.1v7.8l4.58 6.31L15 27.62l7.42-2.41L27 18.9v-7.8l-4.58-6.31L15 2.38z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  )
}

export const getDieIcon = (rating, type, number) => {
  return diceIcons[`d${rating}`](type, number)
}