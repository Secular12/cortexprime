import initializeCortexPrimeCharacter from './scripts/initializeCortexPrimeCharacter.js'

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

  Hooks.on("preCreateActor", (data) => {
    if (game.user == game.users.find(user => user.isGM && user.active)) {
      if (data.type === 'player-character') {
        initializeCortexPrimeCharacter(data)
      }
    }
  })
}
