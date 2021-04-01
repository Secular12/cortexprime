import TraitSettings from './TraitSettings.js'

import { localizer } from '../scripts/foundryHelpers.js'

export const registerSettings = () => {
  game.settings.registerMenu('cortexprime', 'TraitSettings', {
    hint: localizer('TraitSettingsH'),
    icon: 'fas fa-globe',
    label: localizer('TraitSettingsL'),
    name: localizer('TraitSettingsN'),
    restricted: true,
    type: TraitSettings
  })

  game.settings.register('cortexprime', 'hasStress', {
    config: true,
    name: localizer('HasStressN'),
    hint: localizer('HasStressD'),
    default: false,
    restricted: true,
    scope: 'world',
    type: Boolean
  })

  game.settings.register('cortexprime', 'hasTrauma', {
    config: true,
    name: localizer('HasTraumaN'),
    hint: localizer('HasTraumaD'),
    default: false,
    restricted: true,
    scope: 'world',
    type: Boolean
  })

  game.settings.register('cortexprime', 'majorCharacterScale', {
    config: true,
    name: localizer('MajorCharactersHaveScaleN'),
    hint: localizer('MajorCharactersHaveScaleD'),
    default: false,
    restricted: true,
    scope: 'world',
    type: Boolean
  })

  game.settings.register('cortexprime', 'traitSets', {
    name: 'Trait Sets',
    default: {},
    scope: 'world',
    type: Object,
    config: false,
  })
}
