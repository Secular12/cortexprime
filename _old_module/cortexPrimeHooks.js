import { UserDicePool } from './applications/UserDicePool.js'
import { localizer, setCssVars } from './scripts/foundryHelpers.js'
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

  Hooks.once('ready', async () => {
    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]
    setCssVars(theme)
    if (game.settings.get('cortexprime', 'WelcomeSeen') === false) {
      if (game.user.isGM) {
        const seeWelcome = await new Promise(resolve => {
          new Dialog(
            {
              title: localizer('WelcomeTitle'),
              content: `<div class="bkg-lighter-grey ba-2-primary mb-4 pa-2"><p>${localizer('SettingsMessage')}</p></div>`,
              buttons: {
                ok: {
                  label: localizer("Okay"),
                  callback: () => resolve(true)
                }
              },
              default: "ok",
              close: () => resolve(false),
            },
            {
              width: 500,
              height: 'auto',
            }
          ).render(true)
        })

        if (seeWelcome) {
          await game.settings.set('cortexprime', 'WelcomeSeen', true)
        }
      }
    }
  })

  Hooks.on('ready', async () => {
    game.cortexprime.UserDicePool = new UserDicePool()
    await game.cortexprime.UserDicePool.initPool()
  })

  Hooks.on('renderChatMessage', async (message, html, data) => {
    const $rollResult = html.find('.roll-result').first()

    if ($rollResult) {
      const $chatMessage = $rollResult.closest('.chat-message')
      
      $chatMessage
        .addClass('roll-message')
        .prepend('<div class="message-background"></div><div class="message-image"></div>')

      const $messageHeader = $chatMessage.find('.message-header').first()

      $messageHeader.children().wrapAll('<div class="message-header-content"></div>')
      $messageHeader.prepend('<div class="message-header-image"></div><div class="message-header-background"></div>')

      const $dice = $rollResult.find('.die')

      for await (const die of $dice) {
        const $die = $(die)
        const data = $die.data()

        const { dieRating, type, value: number } = data

        const html = await renderTemplate(`systems/cortexprime/templates/partials/dice/d${dieRating}.html`, {
          type,
          number
        })
        $die.html(html)
      }

      html
        .find('.source-header')
        .click(function () {
          const $source = $(this)
          $source
            .find('.fa')
            .toggleClass('fa-chevron-down fa-chevron-up')
          $source
            .siblings('.source-content')
            .toggleClass('hide')
        })

      const getPool = html => {
        return html.find('.source').get().reduce((sources, source) => {
          const $source = $(source)
          return {
            ...sources,
            [$source.data('source')]: $source
              .find('.dice-tag')
              .get()
              .reduce((dice, die, dieIndex) => {
                const $die = $(die)
                return {
                  ...dice,
                  [dieIndex]: {
                    label: $die.data('label'),
                    value: $die.find('.die').get()
                      .reduce((diceValues, dieValue, dieValueIndex) => {
                        return {
                          ...diceValues,
                          [dieValueIndex]: $(dieValue).data('die-rating')
                        }
                      }, {})
                  }
                }
              }, {})
          }
        }, {})
      }
      $rollResult.find('.re-roll').click(async (event) => {
        event.preventDefault()
        const pool = getPool($rollResult)
        await rollDice(pool)
      })
      $rollResult.find('.send-to-pool').click(async (event) => {
        event.preventDefault()
        const pool = getPool($rollResult)
        await game.cortexprime.UserDicePool._setPool(pool)
      })
    }
  })

  // Hooks.on('getSceneControlButtons', controls => {
  //   game.cortexprime.UserDicePool = new UserDicePool()
  //   game.cortexprime.UserDicePool.initPool()

  //   controls
  //     .find(c => c.name == 'token')
  //     .tools.push({
  //       activeTool: 'tokens',
  //       layer: 'tokens',
  //       name: 'cortex-dice-pool',
  //       title: 'cortexprime.dicepool',
  //       toggle: false,
  //       icon: "fas fa-dice",
  //     })
  // })

  Hooks.on('renderSceneControls', (controls, html) => {
    const $dicePoolButton = $(
      `<li class="dice-pool-control" data-control="dice-pool" title="${game.i18n.localize("DicePool")}">
          <i class="fas fa-dice"></i>
          <ol class="control-tools">
          </ol>
      </li>`
    );

    html
      .find('.main-controls')
      .append($dicePoolButton);
    html
    .find('.dice-pool-control')
    .removeClass('control-tool')
    .on('click', async () => {
      await game.cortexprime.UserDicePool.toggle()
    });
  })
}
