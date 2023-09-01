import defaultActorTypes from './defaultActorTypes.js'
import defaultItemTypes from './defaultItemTypes.js'
import CpItemSettings from './documents/CpItemSettings.js'
import CpActorTypeModel from './models/CpActorTypeModel.js'
import CpItemTypeModel from './models/CpItemTypeModel.js'
import { localizer } from './scripts/foundryHelpers.js'

export const registerSettings = () => {
  game.settings.registerMenu('cortexprime', 'ItemSettings', {
    hint: localizer('ItemSettingsH'),
    icon: 'fas fa-user-cog',
    label: localizer('ItemSettings'),
    name: localizer('ItemSettings'),
    restricted: true,
    type: CpItemSettings
  })

  game.settings.register('cortexprime', 'actorTypes', {
    config: false,
    default: defaultActorTypes,
    name: localizer('ActorTypes'),
    scope: 'world',
    type: CpActorTypeModel,
  })

  game.settings.register('cortexprime', 'itemTypes', {
    config: false,
    default: defaultItemTypes,
    name: localizer('ItemTypes'),
    scope: 'world',
    type: CpItemTypeModel,
  })
}