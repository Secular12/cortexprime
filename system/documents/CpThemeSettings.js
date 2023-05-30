import { fieldListeners } from '../lib/formHelpers'
import { displayToggle, localizer } from '../lib/helpers'
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

  get isPresetTheme () {
    return !!presetThemes[this.selectedTheme]
  }

  getData() {
    const data = {
      borderPositions: [
        { name: localizer('CP.None'), value: 'none' },
        { name: localizer('CP.All'), value: 'all' },
        { name: localizer('CP.Bottom'), value: 'bottom' },
        { name: localizer('CP.Top'), value: 'top' },
        { name: localizer('CP.Left'), value: 'left' },
        { name: localizer('CP.Right'), value: 'right' },
        { name: localizer('CP.TopAndBottom'), value: 'top-and-bottom' },
        { name: localizer('CP.LeftAndRight'), value: 'left-and-right' },
      ],
      currentSettings: this.currentSettings,
      isPresetTheme: this.isPresetTheme,
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
    fieldListeners(html)
    displayToggle(html)

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
    if (this.isPresetTheme) {
      Dialog.prompt({
        title: localizer('CP.ValidationError'),
        content: localizer('CP.ThemeDeleteErrorPreset'),
      })

      return
    }

    const confirmed = await Dialog.confirm({
      title: localizer('CP.DeleteThemeConfirmTitle'),
      content: localizer('CP.DeleteThemeConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
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
  }

  async onChangeTheme (event) {
    this.selectedTheme = event.currentTarget.value

    await this.render(true)

    setThemeProperties(this.currentSettings)
  }

  async save (expandedData) {
    const themeSettings = game.settings.get('cortexprime', 'themes')

    const newThemeSettings = mergeObject(themeSettings, expandedData)

    this.selectedTheme = expandedData.selectedTheme

    if (!presetThemes[expandedData.selectedTheme]) {
      const customThemeSettings = mergeObject(newThemeSettings.customList[this.selectedTheme], expandedData.currentSettings)
      this.customThemes[this.selectedTheme] = customThemeSettings
      newThemeSettings.customList[this.selectedTheme] = customThemeSettings
    }

    Log('CpThemeSettings.save newThemeSettings', newThemeSettings)

    await game.settings.set('cortexprime', 'themes', newThemeSettings)

    await this.render(true)

    setThemeProperties(this.currentSettings)

    game.socket.emit('system.cortexprime', {
      type: 'setThemeProperties'
    })
  }
}

// TODO:
// Add expansion/collapse options for the field sections
// add a refresh/revert button
// add a preview button
// border options shouldn't effect theme settings page
// // switch changing themes to not preview that
// Add feedback to clicking "save"
// Image file picker field
// fix layout of theme settings page
// Fix listing traits in RollResult! (showing side by side)
// Fix Multiple Effect Dice in RollResult! (showing one over the other)
// Relook at, finalize, and refactor colors and other styles
// // Heading 1 and 2 for regular cortex prime theme needs some adjusting
// Add swatches option?