import ActorSettings from './ActorSettings.js'
import ImportExportSettings from './ImportExportSettings.js'
import defaultActorTypes from '../actor/defaultActorTypes.js'
import defaultInitiativeTraits from '../actor/defaultInitiativeTraits.js'
import defaultThemes from '../theme/defaultThemes.js'
import ThemeSettings from './ThemeSettings.js'

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
    default: { 0: { active: true, name: 'ActorTypes', localize: true, target: 'actorTypes' } },
    scope: 'world',
    type: Object,
    config: false,
  })

  game.settings.registerMenu("cortexprime", "ImportExportSettings", {
    name: localizer('ImportExportSettings'),
    hint: localizer('ImportExportSettingsHint'),
    icon: 'fas fa-file-import',
    label: localizer('ImportExportSettings'),
    restricted: true,
    type: ImportExportSettings
  })

  game.settings.register('cortexprime', 'rollResultSourceCollapsed', {
    name: localizer('RollResultSourceCollapsed'),
    hint: localizer('RollResultSourceCollapsedHint'),
    label: localizer('RollResultSourceCollapsed'),
    default: false,
    type: Boolean,
    config: true
  })

  game.settings.register('cortexprime', 'initiativeTraits', {
    name: localizer('InitiativeTraits'),
    hint: localizer('InitiativeTraitsHint'),
    label: localizer('InitiativeTraits'),
    default: defaultInitiativeTraits,
    scope: 'world',
    type: String,
    config: true
  })

  game.settings.register('cortexprime', 'importedSettings', {
    name: localizer('ImportedSettings'),
    default: { currentSetting: localizer('Default') },
    scope: 'world',
    type: Object,
    config: false,
  })

  game.settings.register("cortexprime", "WelcomeSeen", {
    name: localizer('WelcomeSeen'),
    hint: localizer('WelcomSeenHint'),
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  })

  game.settings.registerMenu('cortexprime', 'ThemeSettings', {
    hint: localizer('ThemeSettingsH'),
    icon: 'fas fa-user-cog',
    label: localizer('ThemeSettings'),
    name: localizer('ThemeSettings'),
    restricted: true,
    type: ThemeSettings
  })

  game.settings.register('cortexprime', 'themes', {
    name: localizer('Themes'),
    default: defaultThemes,
    scope: 'world',
    type: Object,
    config: false,
  })
}
