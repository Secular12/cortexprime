export default (controls, [$html]) => {
  const dicePoolButton =  
    `<li class="dice-pool-control" data-control="dice-pool" title="${game.i18n.localize("DicePool")}">` +
    '<i class="fas fa-dice"></i>' +
    '<ol class="control-tools"></ol>' +
    '</li>'

  $html
    .querySelector('.main-controls')
    .innerHTML += dicePoolButton

  const $dicePoolControl = $html
    .querySelector('.dice-pool-control')
  
  $dicePoolControl
    .classList
    .remove('control-tool')

  $dicePoolControl
    .addEventListener('click', async () => {
      await game.cortexprime.DicePool.toggle() 
    })
}