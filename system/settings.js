import defaultActorTypes from './defaultActorTypes.js'
import CpActorSettings from './documents/CpActorSettings.js'
import CpActorTypeModel from './models/CpActorTypeModel.js'
import { localizer } from './scripts/foundryHelpers.js'

export const registerSettings = () => {
  game.settings.registerMenu('cortexprime', 'ActorSettings', {
    hint: localizer('ActorSettingsH'),
    icon: 'fas fa-user-cog',
    label: localizer('ActorSettings'),
    name: localizer('ActorSettings'),
    restricted: true,
    type: CpActorSettings
  })

  game.settings.register('cortexprime', 'actorTypes', {
    config: false,
    default: defaultActorTypes,
    name: localizer('ActorTypes'),
    scope: 'world',
    type: CpActorTypeModel,
  })
}