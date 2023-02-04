export default (controls, html) => {
  const $dicePoolButton = $(
    `<li class="dice-pool-control" data-control="dice-pool" title="${game.i18n.localize("DicePool")}">
      <i class="fas fa-dice"></i>
      <ol class="control-tools">
      </ol>
    </li>`
  )

  html
    .find('.main-controls')
    .append($dicePoolButton);

  html
    .find('.dice-pool-control')
    .removeClass('control-tool')
    .on('click', async () => {
      await game.cortexprime.DicePool.toggle()
    })
}