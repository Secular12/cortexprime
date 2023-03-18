import { displayToggleMethod } from '../lib/helpers.js'

export default (log, html, data) => {
  const $chatLog = html.find('#chat-log')
  
  $chatLog
    .on('click', '.display-toggle', displayToggleMethod)
    .on('click', '.RollResult-add-to-pool', (event) => {
      game.cortexprime.DicePool.addToPool(event)
      game.cortexprime.DicePool.render(true)
    })
    .on('click', '.RollResult-re-roll', (event) => {
      game.cortexprime.DicePool.addToPool(event)
      game.cortexprime.DicePool._rollDice('select')
      game.cortexprime.DicePool.clear()
    })
}