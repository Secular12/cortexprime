import { getDieIcon } from '../dice.js'

export const getHtml = (value, options) => {
  return '<div class="die-result' +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '" ' +
    `data-die-rating="${options.hash.dieRating}" ` +
    (options.hash.key ? `data-key="${options.hash.key}" ` : '') +
    (options.hash.resultGroupIndex || options.hash.resultGroupIndex === 0 ? `data-result-group-index="${options.hash.resultGroupIndex}" ` : '') +
    `data-type="${options.hash.type}" ` +
    `data-value="${value}"` +
    '>' +
    '<div class="die-wrapper">' +
    '<div class="die-container">' +
    getDieIcon(options.hash.dieRating, options.hash.type, value) +
    '</div>' +
    '</div>' +
    (options.hash.hideLabel ? '' : `<span class="die-result-label">d${options.hash.dieRating}</span>`) +
    '</div>'
}

export default (value, options) => {
  return new Handlebars.SafeString(getHtml(value, options))
}