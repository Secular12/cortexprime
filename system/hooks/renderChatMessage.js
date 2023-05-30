import { getHtml } from '../lib/handlebarHelpers/dieResult.js'

export default (message, html, data) => {
  const $rollResult = html.find('.RollResult-main').first()

  if ($rollResult.length > 0) {
    html.addClass('cortexprime RollResult theme-body')

    $rollResult
      .find('.chat-die')
      .each(function () {
        const $die = $(this)

        const data = $die.data()

        const { dieRating, hideLabel, resultGroupIndex, type, value } = data

        const html = getHtml(value, {
          hash: {
            class: 'RollResult-die-result',
            dieRating,
            hideLabel: !!hideLabel,
            resultGroupIndex,
            type
          }
        })

        $die.replaceWith(html)
      })
  }
}