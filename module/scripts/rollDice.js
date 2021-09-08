import { objectReduce } from '../../lib/helpers.js'
import { localizer } from './foundryHelpers.js'

const getRollFormula = (pool) => {
  return objectReduce(pool, (formula, traitGroup) => {
    const innerFormula = objectReduce(traitGroup || {}, (acc, trait) => [...acc, ...Object.values(trait.value || {})], [])
      .reduce((acc, value) => `${acc}+d${value}`, '')

    return formula ? `${formula}+${innerFormula}` : innerFormula
  }, '')
}

const getRollResults = async pool => {
  const rollFormula = getRollFormula(pool)

  const r = new Roll(rollFormula)

  const roll = await r.evaluate({ async: true })

  if (game.dice3d) {
    game.dice3d.showForRoll(r, game.user, true)
  }

  const rollResults = roll.dice
    .map(die => ({ faces: die.faces, result: die.results[0].result }))
    .reduce((acc, result) => {
      if (result.result > 1) {
        return { ...acc, results: [...acc.results, result] }
      }

      return { ...acc, hitches: [...acc.hitches, result] }
    }, { hitches: [], results: [] })

  rollResults.hitches.sort((a, b) => {
    return b.faces - a.faces
  })

  rollResults.results.sort((a, b) => {
    if (a.result !== b.result) {
      return b.result - a.result
    }

    return b.faces - a.faces
  })

  return rollResults
}

const markResultTotals = results => {
  results.sort((a, b) => {
    if (a.result !== b.result) {
      return b.result - a.result
    }

    return a.faces - b.faces
  })

  return results.reduce((acc, result) => {
    if (!result.effect && acc.count < 2) return { dice: [...acc.dice, { ...result, total: true }], count: acc.count + 1 }

    return { dice: [...acc.dice, result], count: acc.count }
  }, { dice: [], count: 0 }).dice
}

const markResultEffect = results => {
  results.sort((a, b) => {
    if (a.faces !== b.faces) {
      return b.faces - a.faces
    }

    return a.result - b.result
  })

  return results.reduce((acc, result) => {
    const hasEffectDie = acc.some(item => item.effect)
    if (!result.total && !hasEffectDie) return [...acc, { ...result, effect: true }]

    return [...acc, result]
  }, [])
}

const getDiceByEffect = results => {
  const effectMarkedResults = results.length > 2 ? markResultEffect(results) : results
  const finalResults = markResultTotals(effectMarkedResults)

  finalResults.sort((a, b) => {
    if (a.result !== b.result) {
      return b.result - a.result
    }

    return b.faces - a.faces
  })

  const total = finalResults.reduce((totalValue, result) => result.total ? totalValue + result.result : totalValue, 0)
  const targetEffectDie = finalResults.find(result => result.effect)
  const effectDice = targetEffectDie?.faces ? [targetEffectDie.faces] : []

  return { dice: finalResults, total, effectDice }
}

const getDiceByTotal = results => {
  const totalMarkedResults = markResultTotals(results)
  const finalResults = markResultEffect(totalMarkedResults)

  finalResults.sort((a, b) => {
    if (a.result !== b.result) {
      return b.result - a.result
    }

    return b.faces - a.faces
  })

  const total = finalResults.reduce((totalValue, result) => result.total ? totalValue + result.result : totalValue, 0)
  const targetEffectDie = finalResults.find(result => result.effect)
  const effectDice = targetEffectDie?.faces ? [targetEffectDie.faces] : []

  return { dice: finalResults, total, effectDice }
}

const updateDice = (html, dice) => {
  const $dice = html.find('.dice-box .result-die')

  $dice.each(function (index) {
    const $die = $(this)
    const targetDie = dice.dice[index]
    $die.removeClass('chosen result effect selected selectable')

    if (targetDie.total) {
      $die.addClass('chosen')
    } else if (targetDie.effect) {
      $die.addClass('effect')
    } else {
      $die.addClass('result selectable')
    }
  })

  const $effectDiceContainer = html.find('.effect-dice')
  const $totalValue = html.find('.total-value')
  $totalValue.text(dice.total)

  $effectDiceContainer.find('.die-icon-wrapper')?.remove()
  const faces = dice.effectDice.length === 0 ? 4 : dice.effectDice[0]
  const index = dice.dice.findIndex(x => x.effect)

  $effectDiceContainer
    .append(`<div class="die-icon-wrapper my-1${dice.effectDice.length === 0 ? ' default' : ''}" data-key="${index}"><div class="die-icon d${faces} effect"><div class="value">${faces}</div></div></div>`)
}

const dicePicker = async rollResults => {
  const content = await renderTemplate('systems/cortexprime/templates/dialog/dice-picker.html', {
    rollResults
  })

  return new Promise((resolve, reject) => {
    new Dialog({
      title: "Select Your Dice",
      content,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: localizer('Confirm'),
          callback (html) {
            const $diceBox = html
              .find('.dice-box')

            const values = { dice: [], total: null, effectDice: [] }

            $diceBox
              .find('.result-die')
              .each(function () {
                const $die = $(this)
                const faces = $die.data('faces')
                const result = parseInt($die.data('result'), 10)
                const value = { effect: false, faces, result, total: false }

                if ($die.hasClass('chosen')) {
                  values.total = values.total ? values.total + result : result
                  value.total = true
                } else if ($die.hasClass('effect')) {
                  values.effectDice.push(faces)
                  value.effect = true
                }

                values.dice.push(value)
              })

            resolve(values)
          }
        }
      },
      default: 'confirm',
      render (html) {
        const $diceBox = html.find('.dice-box')
        const $addToTotal = html.find('.add-to-total')
        const $addToEffect = html.find('.add-to-effect')
        const $resetSelection = html.find('.reset-selection')
        const $effectDiceContainer = html.find('.effect-dice')

        const setSelectionOptionsDisableTo = (value) => {
          $addToTotal.prop('disabled', value ?? !$addToTotal.prop('disabled'))
          $addToEffect.prop('disabled', value ?? !$addToEffect.prop('disabled'))
        }

        const setSelectionDisable = () => {
          const $selectedDice = $diceBox.find('.selected')
          const $usedDice = $diceBox.find('.effect, .chosen')

          setSelectionOptionsDisableTo(!($selectedDice.length > 0))
          $resetSelection.prop('disabled', !($selectedDice.length > 0 || $usedDice.length > 0))
        }

        const setEffectDice = (values, defaultValue = false) => {
          const effectDiceHtml = values
            .map(value => `<div class="die-icon-wrapper my-1${defaultValue ? ' default' : ''}"><div class="die-icon d${value} effect"><div class="value">${value}</div></div></div>`)
            .join()

          $effectDiceContainer
            .html(effectDiceHtml)
         }

        const setTotalValue = (value) => {
          html
            .find('.total-value')
            .text(value)
        }

        html
          .closest('.window-app.dialog')
          .find('.header-button.close')
          .click((event) => {
            event.preventDefault()

            const values = { dice: [], total: null, effectDice: [] }

            $diceBox
              .find('.result-die')
              .each(function () {
                const $die = $(this)
                const faces = $die.data('faces')
                const result = parseInt($die.data('result'), 10)
                const value = { effect: false, faces, result, total: false }

                values.dice.push(value)
              })

            resolve(values)
          })

        $diceBox.on('click', '.selectable', function () {
          const $target = $(this)

          $target.toggleClass('selected result')

          setSelectionDisable()
        })

        $diceBox.on('click', '.effect', function () {
          const $selectedDie = $(this)
          $selectedDie.toggleClass('result effect selectable')
          const key = $selectedDie.data('key')

          const $targetEffectDie = $effectDiceContainer.find(`[data-key="${key}"]`)
          $targetEffectDie.remove()

          const $effectDice = $effectDiceContainer.find('.die-icon-wrapper')

          if ($effectDice.length === 0) {
            $effectDiceContainer
              .append(`<div class="die-icon-wrapper my-1 default"><div class="die-icon d4 effect"><div class="value">4</div></div></div>`)
          }

          setSelectionDisable()
        })

        $diceBox.on('click', '.chosen', function () {
          const $selectedDie = $(this)
          $selectedDie.toggleClass('chosen result selectable')
          const result = parseInt($selectedDie.data('result'), 10)
          const $totalValue = html.find('.total-value')
          const currentValue = parseInt($totalValue.text(), 10)
          $totalValue.text(currentValue - result)

          setSelectionDisable()
        })

        $effectDiceContainer.on('mouseup', '.die-icon-wrapper', function (event) {
          if (event.button === 2) {
            const $dieWrapper = $(this)

            const key = $dieWrapper.data('key')

            const $resultDie = $diceBox.find(`.result-die[data-key="${key}"]`)

            $resultDie.toggleClass('effect result selectable')

            $dieWrapper.remove()

            const $diceWrappers = $effectDiceContainer.find('.die-icon-wrapper')

            if ($diceWrappers.length === 0) {
              $effectDiceContainer
                .append(`<div class="die-icon-wrapper my-1 default"><div class="die-icon d4 effect"><div class="value">4</div></div></div>`)
            }

            setSelectionDisable()
          }
        })

        $addToEffect
          .click(function () {
            const $diceForTotal = html.find('.result-die.selected')

            if ($diceForTotal.length > 0) {

              $effectDiceContainer.find('.default')?.remove()

              $diceForTotal.each(function () {
                const $die = $(this)
                const faces = $die.data('faces')
                const key = $die.data('key')
                $die.toggleClass('selected effect selectable')

                $effectDiceContainer
                  .append(`<div class="die-icon-wrapper my-1" data-key="${key}"><div class="die-icon d${faces} effect"><div class="value">${faces}</div></div></div>`)
              })

              setSelectionDisable()
            }
          })

        $addToTotal
          .click(function () {
            const $diceForTotal = html.find('.result-die.selected')

            $diceForTotal.each(function () {
              const $die = $(this)
              $die.toggleClass('chosen selected selectable')
              const result = parseInt($die.data('result'), 10)
              const $totalValue = html.find('.total-value')
              const currentValue = parseInt($totalValue.text(), 10)
              $totalValue.text(result + currentValue)
            })

            setSelectionDisable()
          })

        html
          .find('.select-by-effect')
          .click(function () {
            const dice = getDiceByEffect(rollResults.results)

            updateDice(html, dice)

            setSelectionDisable()
          })

        html
          .find('.select-by-total')
          .click(function () {
            const dice = getDiceByTotal(rollResults.results)

            updateDice(html, dice)

            setSelectionDisable()
          })

        $resetSelection
          .click(function () {
            $diceBox
              .find('.selected, .effect, .chosen')
              .each(function () {
                const $target = $(this)

                $target.removeClass('chosen effect selected')
                $target.addClass('result selectable')
              })

            setTotalValue(0)
            setEffectDice([4], true)

            setSelectionOptionsDisableTo(true)
            $(this).prop('disabled', true)
          })
      }
    }, { jQuery: true }).render(true)
  })
}

export default async function (pool, rollType) {
  const rollResults = await getRollResults(pool)

  await this?._clearDicePool()

  const selectedDice = rollType === 'total'
    ? getDiceByTotal(rollResults.results)
    : rollType === 'effect'
      ? getDiceByEffect(rollResults.results)
      : await dicePicker(rollResults)

  const content = await renderTemplate('systems/cortexprime/templates/chat/roll-result.html', {
    dicePool: pool,
    effectDice: selectedDice.effectDice,
    rollResults: { hitches: rollResults.hitches, results: selectedDice.dice },
    speaker: game.user,
    total: selectedDice.total
  })

  await ChatMessage.create({ content })
}