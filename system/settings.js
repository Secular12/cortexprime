import defaultActorTypes from './defaultActorTypes.js'
import CpGeneralSettings from './documents/CpGeneralSettings.js'
import CpActorTypeModel from './models/CpActorTypeModel.js'
import { localizer } from './scripts/foundryHelpers.js'

export const registerSettings = () => {
  game.settings.registerMenu('cortexprime', 'GeneralSettings', {
    hint: localizer('GeneralSettingsH'),
    icon: 'fas fa-user-cog',
    label: localizer('GeneralSettings'),
    name: localizer('GeneralSettings'),
    restricted: true,
    type: CpGeneralSettings
  })

  game.settings.register('cortexprime', 'actorTypes', {
    config: false,
    default: defaultActorTypes,
    name: localizer('ActorTypes'),
    scope: 'world',
    type: CpActorTypeModel,
  })
}