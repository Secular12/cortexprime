// import initializeCortexPrimeCharacter from './scripts/initializeCortexPrimeCharacter.js'
import { UserDicePool } from './applications/UserDicePool.js'
import rollDice from './scripts/rollDice.js'

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

  Hooks.on('ready', async () => {
    game.cortexprime.UserDicePool = new UserDicePool()
    await game.cortexprime.UserDicePool.initPool()
  })

  Hooks.on('renderChatMessage', async (message, html, data) => {
    const getPool = html => {
      return html.find('.source').get().reduce((sources, source) => {
        const $source = $(source)
        return {
          ...sources,
          [$source.data('source')]: $source.find('.die-label').get()
            .reduce((dice, die, dieIndex) => {
              const $die = $(die)
              return {
                ...dice,
                [dieIndex]: {
                  label: $die.data('label'),
                  value: $die.find('.die-icon').get()
                    .reduce((diceValues, dieValue, dieValueIndex) => {
                      return {
                        ...diceValues,
                        [dieValueIndex]: $(dieValue).data('rating')
                      }
                    }, {})
                }
              }
            }, {})
        }
      }, {})
    }
    html.find('.re-roll').click(async (event) => {
      event.preventDefault()
      const pool = getPool(html)
      await rollDice(pool)
    })
    html.find('.send-to-pool').click(async (event) => {
      event.preventDefault()
      const pool = getPool(html)
      await game.cortexprime.UserDicePool._setPool(pool)
    })
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
    $dicePoolButton[0].addEventListener('click', async () => {
      await game.cortexprime.UserDicePool.toggle()
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
