import { getHtml } from '../lib/handlebarHelpers/dieResult.js'

export default (message, [$html], data) => {
  const $rollResult = $html.querySelector('.RollResult-main')

  if ($rollResult) {
    $html.classList.add('cortexprime', 'RollResult', 'theme-body')

    $rollResult
      .querySelectorAll('.chat-die')
      .forEach(($die) => {
        const {
          dieRating,
          hideLabel,
          resultGroupIndex,
          type,
          value
        } = $die.dataset

        const html = getHtml(value, {
          hash: {
            class: 'RollResult-die-result',
            dieRating,
            hideLabel: !!hideLabel,
            resultGroupIndex,
            type,
          }
        })

        $die.outerHTML = html
      })
  }
}