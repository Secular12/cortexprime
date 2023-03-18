import { localizer } from './helpers.js'
import Logger from './Logger.js'
import dicePickerRender from './dicePickerRender.js'

const Log = Logger()

const dicePicker = async rollResults => {
  Log('rollDice.dicePicker rollResults:', rollResults)

  const content = await renderTemplate('systems/cortexprime/system/templates/DicePicker.html', {
    rollResults
  })

  return new Promise((resolve, reject) => {
    new Dialog({
      title: localizer('CP.SelectYourDice'),
      content,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: localizer('CP.Confirm'),
          callback (html) {
            const $dieResults = html.find('.DicePicker-die-result')

            const values = { dice: [], total: null, effectDice: [] }

            $dieResults
              .each(function () {
                const $die = $(this)
                
                const dieRating = $die.data('die-rating')
                const resultGroupIndex = parseInt($die.data('result-group-index'), 10)
                const type = $die.data('type')
                const value = parseInt($die.data('value'), 10)

                if (type === 'chosen') {
                  values.total = values.total ? values.total + value : value
                } else if (type === 'effect') {
                  values.effectDice.push(dieRating)
                }

                const groupValues = values.dice[resultGroupIndex] ?? []

                values.dice[resultGroupIndex] = [
                  ...groupValues,
                  {
                    dieRating,
                    type,
                    value,
                  }
                ]
              })

            resolve(values)
          }
        }
      },
      default: 'confirm',
      render: dicePickerRender(resolve),
    }, { jQuery: true, classes: ['dialog', 'DicePicker', 'cortexprime'] }).render(true)
  })
}

const display3dDice = ({ rollMode, throws }) => {
  if (game.dice3d) {
    const synchronize = rollMode !== 'selfroll'
    const whisper = ['gmroll', 'blindroll'].includes(rollMode)
      ? game.users.filter(u => u.isGM).map(u => u.id)
      : null
    const blind = rollMode === 'blindroll'

    game.dice3d.show({ throws }, game.user, synchronize, whisper, blind)
  }
}

const getRollFormulas = (pool) => {
  return pool
    .reduce((formulas, source) => {
      return source.traits.reduce((acc, trait) => {
        if (trait.rollsSeparately) {
          return [
            ...formulas,
            {
              name: trait.name,
              formula: `d${trait.dice.join('+d')}`,
              hasHitches: trait.hasHitches,
              rollsSeparately: true,
            }
          ]
        }

        acc[0].formula = `${acc[0].formula ? (acc[0].formula + '+') : ''}d` +
          trait.dice.join('+d')

        return acc
      }, formulas)
    }, [{ name: null, formula: '', hasHitches: true, rollsSeparately: false, }])
    .filter(({ formula }) => !!formula)
}

const getRollResults = async pool => {
  const rollFormulas = getRollFormulas(pool)

  Log('rollDice.getRollResults rollFormulas', rollFormulas)

  const results = await rollByFormulas(rollFormulas)

  const throws = getThrows(results)

  return {
    results,
    throws
  }
}

const getSelectedDice = results => {
  return results
    .reduce(({ effectDice, total }, resultGroup) => {
      const targetEffectDie = resultGroup.rollsSeparately
        ? null
        : resultGroup.results.find(result => result.type === 'effect')
      return {
        effectDice: targetEffectDie?.dieRating ? [...effectDice, targetEffectDie.dieRating] : effectDice,
        total: total + resultGroup.results.reduce((totalValue, result) => result.type === 'chosen' ? totalValue + result.value : totalValue, 0)
      }
    }, { effectDice: [], total: 0 })
}

const getThrows = (results) => {
  return results.reduce((acc, result) => {
    return [
      ...acc,
      {
        dice: result.roll.dice.map(die => ({
          options: {},
          result: die.total,
          resultLabel: die.total,
          type: `d${die.faces}`,
          vectors: [],
        }))
      }
    ]
  }, [])
}

const initDiceValues = ({ roll, rollFormula }) => {
  return roll.dice.map(die => ({
    dieRating: die.faces,
    type: die.total > 1 || !rollFormula.hasHitches ? 'unchosen' : 'hitch',
    value: die.total
  }))
}

const markResultEffect = results => {
  if (results.rollsSeparately) return results

  results.results = sortResultsByDieRating(results.results)

  results.results = results.results.reduce((acc, result) => {
    const hasEffectDie = acc.some(item => item.type === 'effect')
    if (!['chosen', 'hitch'].includes(result.type) && !hasEffectDie) return [...acc, { ...result, type: 'effect' }]

    return [...acc, result]
  }, [])

  return results
}

const markResultTotals = results => {
  const selectedTotalCount = results.rollsSeparately ? 1 : 2

  results.results = sortResultsByValue(results.results)

  results.results = results.results.reduce((acc, result) => {
    if (!['effect', 'hitch'].includes(result.type) && acc.count < selectedTotalCount) {
      return { dice: [...acc.dice, { ...result, type: 'chosen' }], count: acc.count + 1 }
    }

    return { dice: [...acc.dice, result], count: acc.count }
  }, { dice: [], count: 0 }).dice

  return results
}

const renderRollResult = async ({ diceSelections, effectDice, pool, results, rollMode, total }) => {
  const contentData = {
    effectDice,
    pool,
    resultGroups: results.map((resultGroup, resultGroupIndex) => {
      resultGroup.diceSelection = diceSelections[resultGroupIndex]
      return resultGroup
    }),
    speaker: game.user,
    total: total ?? 0
  }

  Log('rollDice.renderRollResult contentData:', contentData)

  const content = await renderTemplate('systems/cortexprime/system/templates/RollResult.html', contentData)

  const chatData = ChatMessage.applyRollMode({ content }, rollMode)

  ChatMessage.create(chatData)
}

const rollByFormulas = async (rollFormulas) => {
  return Promise.all(rollFormulas.map(async (rollFormula) => {
    const r = new Roll(rollFormula.formula)
    
    const roll = await r.evaluate({ async: true })

    const results = initDiceValues({ roll, rollFormula })

    const sortedResults = sortResultsByValue(results)

    return {
      ...rollFormula,
      results: sortedResults,
      roll
    }
  }))
}

const rollForEffect = results => {
  const effectMarkedResults = results.map(x => markResultEffect(x))
  const finalResults = effectMarkedResults.map(x => markResultTotals(x))

  const {
    effectDice,
    total
  } = getSelectedDice(finalResults)
  
  Log('rollDice.rollForEffect finalResults, effectDice, total:', finalResults, effectDice, total)

  return {
    dice: finalResults.map(x => x.results),
    effectDice,
    total
  }
}

const rollForTotal = results => {
  const totalMarkedResults = results.map(x => markResultTotals(x))
  const finalResults = totalMarkedResults.map(x => {
    const markedResults = markResultEffect(x)
    markedResults.results = sortResultsByValue(markedResults.results)
    
    return markedResults
  })

  const {
    effectDice,
    total
  } = getSelectedDice(finalResults)

  Log('rollDice.rollForTotal finalResults, effectDice, total:', finalResults, effectDice, total)

  return {
    dice: finalResults.map(x => x.results),
    effectDice,
    total
  }
}

const selectByType = async ({ results, rollType }) => {
  return rollType === 'select'
    ? await dicePicker(results)
    : rollType === 'total'
      ? rollForTotal(results)
      : rollForEffect(results)
}

const sortResultsByDieRating = results => {
  const r = [...results]
  
  r.sort((a, b) => {
    if (a.dieRating !== b.dieRating) {
      return b.dieRating - a.dieRating
    }

    return b.value - a.value
  })

  return r
}

const sortResultsByValue = results => {
  const r = [...results]
  
  r.sort((a, b) => {
    if (a.value !== b.value) {
      return b.value - a.value
    }

    return b.dieRating - a.dieRating
  })

  return r
}

export default async function (pool, rollType, rollMode) {
  const { results, throws } = await getRollResults(pool)

  Log('rollDice.default rollMode, rollType, results, throws', rollMode, rollType, results, throws)

  await this?.clear()
  this?.close()

  const {
    dice: diceSelections,
    effectDice,
    total,
  } = await selectByType({ results, rollType })

  Log('rollDice.default diceSelections:', diceSelections)

  display3dDice({ rollMode, throws })

  await renderRollResult({
    diceSelections,
    effectDice,
    pool,
    results,
    rollMode,
    total,
  })
}