import initializeCortexPrimeCharacter from './scripts/initializeCortexPrimeCharacter.old.js'

export default () => {
  Hooks.once('diceSoNiceReady', dice3d => {
    dice3d.addSystem({ id: 'cp-pp', name: 'Cortex Prime Plot Point' }, false)
    const ppLabel = 'systems/cortexprime/assets/plot-point/plot-point.png'
    dice3d.addDicePreset({
      type: 'dp',
      labels: [ppLabel, ppLabel],
      system: 'standard',
      colorset: 'bronze'
    }, 'd2')
  })

  Hooks.on('renderSceneControls', (controls, html) => {
    const $dicePoolButton = $(
      `<li class="scene-control dice-pool-control" data-control="dice-pool" title="${game.i18n.localize("DicePool")}">
          <i class="fas fa-dice"></i>
          <ol class="control-tools">
          </ol>
      </li>`
    );

    html.prepend($dicePoolButton);
    $dicePoolButton[0].addEventListener('click', async ev => {
      const userDicePool = game.user.getFlag('cortexprime', 'dicePool')

      if (!userDicePool) {
        await game.user.setFlag('cortexprime', 'dicePool', { label: '', dice: {} })
      }
    });
  })

  // Hooks.on("preCreateActor", (data) => {
  //   if (game.user == game.users.find(user => user.isGM && user.active)) {
  //     if (data.type === 'character') {
  //       initializeCortexPrimeCharacter(data)
  //     }
  //   }
  // })
}
