import CpThemeSettings from './documents/CpThemeSettings'
import CpTraitSettings from './documents/CpTraitSettings'
import defaultItemTypes from './lib/defaultItemTypes'
import defaultThemes from './lib/defaultThemes'
import { localizer } from './lib/helpers'

export const registerSettings = () => {
  game.settings.register('cortexprime', 'themes', {
    name: localizer('Themes'),
    default: defaultThemes,
    scope: 'world',
    type: Object,
    config: false,
  })

  game.settings.registerMenu('cortexprime', 'ThemeSettings', {
    hint: localizer('CP.ThemeSettingsHint'),
    icon: 'fas fa-palette',
    label: localizer('CP.ThemeSettings'),
    name: localizer('CP.ThemeSettings'),
    restricted: true,
    type: CpThemeSettings,
  })

  game.settings.register('cortexprime', 'itemTypes', {
    config: false,
    default: defaultItemTypes,
    name: localizer('CP.ItemTypes'),
    scope: 'world',
    type: Object,
  })

  game.settings.registerMenu('cortexprime', 'Traitettings', {
    hint: localizer('CP.TraitSettingsHint'),
    icon: 'fas fa-palette',
    label: localizer('CP.TraitSettings'),
    name: localizer('CP.TraitSettings'),
    restricted: true,
    type: CpTraitSettings,
  })
}