const getRollFormula = (pool) => {
  return Object.values(pool)
    .reduce((formula, traitGroup) => {
      const innerFormula = Object.values(traitGroup || {})
        .reduce((acc, trait) => [...acc, ...Object.values(trait.value || {})], [])
        .reduce((acc, value) => {
          return `${acc}+d${value}`
        }, '')

      return formula ? `${formula}+${innerFormula}` : innerFormula
    }, '')
}

export default async pool => {
  console.log(pool)
  const rollFormula = getRollFormula(pool)

  const r = new Roll(rollFormula)

  const roll = await r.evaluate({ async: true })

  if (game.dice3d) {
    await game.dice3d.showForRoll(roll, game.user, true)
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

  const message = await renderTemplate('systems/cortexprime/templates/chat/roll-result.html', {
    dicePool: pool,
    rollResults,
    speaker: game.user
  })

  await ChatMessage.create({ content: message })
}