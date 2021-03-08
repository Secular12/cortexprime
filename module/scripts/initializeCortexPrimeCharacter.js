const getDefaultDice = ({ minDieRating, maxDieRating }) => {
  return {
    values: {
      0: [8, 6, 10, 4, 12, 0].find(option => option >= minDieRating && option <= maxDieRating) || 0
    }
  }
}

export default async (data) => {
  const actor = new Actor(data)
  const workingData = duplicate(data.data)
  const characterData = workingData.data

  const traitSetSettings = game.settings.get('cortexprime', 'traitSets')

  characterData.traitSets = Object.keys(traitSetSettings)
    .reduce((traitSets, traitSetKey) => {
      return {
        ...traitSets,
        [traitSetKey]: {
          ...traitSetSettings[traitSetKey],
          traits: Object.keys(traitSetSettings[traitSetKey].traits || {})
            .reduce((traits, traitKey) => {
              return {
                ...traits,
                [traitKey]: {
                  ...traitSetSettings[traitSetKey].traits[traitKey],
                  dice: getDefaultDice(traitSetSettings[traitSetKey]),
                  label: ''
                }
              }
            }, {})
        }
      }
    }, {})

  workingData.data = characterData

  await actor.update(workingData)
  await actor.sheet.render(false)
}
