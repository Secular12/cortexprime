import { localizer } from '../lib/helpers'
import Logger from '../lib/Logger'
import presetThemes from '../lib/presetThemes'
import { setThemeProperties } from '../lib/setThemeProperties'

const Log = Logger()

export default class CpThemeSettings extends FormApplication {
  constructor() {
    super()

    const themeSettings = game.settings.get('cortexprime', 'themes')

    Log('CpThemeSettings.constructor themeSettings', themeSettings)

    this.customThemes = themeSettings.customList

    this.selectedTheme = themeSettings.selectedTheme
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'ThemeEditor', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ThemeSettings',
      left: 400,
      resizable: false,
      submitOnChange: false,
      subitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpThemeSettings.html',
      title: localizer('CP.ThemeSettings'),
      top: 200,
      width: 600,
    })
  }

  get allThemes () {
    return {
      ...presetThemes,
      ...this.customThemes,
    }
  }

  get allThemeNames () {
    return Object.keys(this.allThemes)
  }

  get currentSettings () {
    return this.allThemes[this.selectedTheme]
  }

  get isPrimaryTheme () {
    return !!presetThemes[this.selectedTheme]
  }

  getData() {
    const data = {
      isPresetTheme: this.isPrimaryTheme,
      currentSettings: this.currentSettings,
      selectedTheme: this.selectedTheme,
      themeOptions: [
        {
          label: localizer('CP.PresetThemes'),
          options: Object.keys(presetThemes)
          .map(themeName => ({ name: themeName, value: themeName }))
        },
        {
          label: 'Custom Themes',
          options: Object.keys(this.customThemes)
          .map(themeName => ({ name: themeName, value: themeName }))
        },
      ],
    }

    Log('CPThemeSettings.getData data:', data)

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = expandObject(formData)

    Log('CPThemeSettings._updateSettings expandedData:', expandedData)

    const {
      selectedTheme,
    } = expandedData

    this.selectedTheme = selectedTheme
    
    await this.save(expandedData)
  }

  activateListeners(html) {
    super.activateListeners(html)

    html.find('#Theme-theme-select').change(this.onChangeTheme.bind(this))
    html.find('#Theme-custom-theme-create').click(() => this.createCustomTheme.call(this, html))
    html.find('#Theme-delete').click(this.deleteTheme.bind(this))
  }

  close () {
    super.close()

    setThemeProperties()
  }

  async createCustomTheme (html) {
    const customThemeName = (html.find('#Theme-custom-theme-name').val() ?? '').trim()

    const errorMessage = !customThemeName
      ? localizer('CP.CustomThemeNameErrorRequired')
      : this.allThemeNames.includes(customThemeName)
        ? localizer('CP.CustomThemeNameErrorDuplicate')
        : null

    if (errorMessage) {
      Dialog.prompt({
        title: localizer('CP.ValidationError'),
        content: errorMessage,
      })
    } else {
      const themeSettings = game.settings.get('cortexprime', 'themes')

      const newCustomThemes = {
        ...themeSettings.customList,
        [customThemeName]: { ...this.currentSettings }
      }

      themeSettings.customList = newCustomThemes
      this.customThemes = newCustomThemes

      themeSettings.selectedTheme = customThemeName
      this.selectedTheme = customThemeName

      await game.settings.set('cortexprime', 'themes', themeSettings)

      await this.render(true)

      setThemeProperties(this.currentSettings)

      game.socket.emit('system.cortexprime', {
        type: 'setThemeProperties'
      })
    }
  }

  async deleteTheme () {
    if (this.isPrimaryTheme) {
      Dialog.prompt({
        title: localizer('CP.ValidationError'),
        content: localizer('CP.ThemeDeleteErrorPreset'),
      })
    }

    const themeSettings = game.settings.get('cortexprime', 'themes')

    delete themeSettings.customList[this.selectedTheme]

    themeSettings.selectedTheme = 'Cortex Prime'

    this.selectedTheme = 'Cortex Prime'

    await game.settings.set('cortexprime', 'themes', themeSettings)

    await this.render(true)

    setThemeProperties(this.currentSettings)

    game.socket.emit('system.cortexprime', {
      type: 'setThemeProperties'
    })
  }

  async onChangeTheme (event) {
    this.selectedTheme = event.currentTarget.value

    await this.render(true)

    setThemeProperties(this.currentSettings)
  }

  async save (expandedData) {
    const themeSettings = game.settings.get('cortexprime', 'themes')

    setThemeProperties(this.allThemes[expandedData.selectedTheme])

    this.selectedTheme = expandedData.selectedTheme

    await game.settings.set('cortexprime', 'themes', mergeObject(themeSettings, expandedData))

    await this.render(true)

    game.socket.emit('system.cortexprime', {
      type: 'setThemeProperties'
    })
  }
}

// TODO:
// Fix background colors for all themes to work with text and look good
// fix relative backgrounds to stay in place int he case of scrolls
// Create theme variables for what currently exists
  // input label colors and font sizes, styles, etc.
  // heading colors and font sizes, styles, etc.
// create fields for various variables in theme settings
// Apply themes to everything that currently exists
// Relook at, finalize, and refactor colors and other styles