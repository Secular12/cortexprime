import { displayToggleMethod } from '../lib/helpers.js'

export default (log, [$html], data) => {
  $html
    .querySelector('#chat-log')
    .addEventListener('click', event => {
      const $displayToggle = event.target.closest('.display-toggle')
      const $rollResultAddToPool = event.target.closest('.RollResult-add-to-pool')
      const $rollResultReRoll = event.target.closest('.RollResult-re-roll')

      if ($displayToggle) {
        displayToggleMethod(event, $displayToggle)
        return
      }

      if ($rollResultAddToPool) {
        game.cortexprime.DicePool.addToPool(event, $rollResultAddToPool)
        game.cortexprime.DicePool.render(true)
        return
      }

      if ($rollResultReRoll) {
        game.cortexprime.DicePool.addToPool(event, $rollResultReRoll)
        game.cortexprime.DicePool._rollDice('select')
        game.cortexprime.DicePool.clear()

      }
    })
}
