export default (data) => {
  const traitSetSettings = game.settings.get('cortexprime', 'traitSets')

  data.data = {}

  data.data.traitSets = Object.keys(traitSetSettings)
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

  if (hasScale) {
    data.data.scale = {
      edit: false,
      value: {}
    }
  }
}
