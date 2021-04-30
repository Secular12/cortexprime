import ActorSettings from './ActorSettings.js'
import defaultActorTypes from '../actor/defaultActorTypes.js'

import { localizer } from '../scripts/foundryHelpers.js'

export const registerSettings = () => {
  game.settings.registerMenu('cortexprime', 'ActorSettings', {
    hint: localizer('ActorSettingsH'),
    icon: 'fas fa-user-cog',
    label: localizer('ActorSettings'),
    name: localizer('ActorSettings'),
    restricted: true,
    type: ActorSettings
  })

  game.settings.register('cortexprime', 'actorTypes', {
    name: localizer('ActorTypes'),
    default: defaultActorTypes,
    scope: 'world',
    type: Object,
    config: false,
  })

  game.settings.register('cortexprime', 'actorBreadcrumbs', {
    name: localizer('ActorBreadcrumbs'),
    default: { 0: { active: true, name: 'ActorTypes', localize: true } },
    scope: 'world',
    type: Object,
    config: false,
  })
}
