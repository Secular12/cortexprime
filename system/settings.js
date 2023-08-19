import CpThemeSettings from './documents/CpThemeSettings'
import CpGeneralSettings from './documents/CpGeneralSettings'
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

  game.settings.registerMenu('cortexprime', 'Generalettings', {
    hint: localizer('CP.GeneralSettingsHint'),
    icon: 'fas fa-palette',
    label: localizer('CP.GeneralSettings'),
    name: localizer('CP.GeneralSettings'),
    restricted: true,
    type: CpGeneralSettings,
  })
}