import { fieldListeners } from '../lib/formHelpers'
import { displayToggleMethod, localizer } from '../lib/helpers'
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

    this.expandedSections = []

    this.selectedTheme = themeSettings.selectedTheme

    this.themeSelection = themeSettings.selectedTheme
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
      expandedSections: this.expandedSections,
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

    html.find('.display-toggle').click(this.onDisplayToggle.bind(this))
    html.find('#Theme-theme-select').change(this.onChangeTheme.bind(this))
    html.find('#Theme-custom-theme-create').click(() => this.createCustomTheme.call(this, html))
    html.find('#Theme-delete').click(this.deleteTheme.bind(this))
    html.find('#Theme-preview').click(this.preview.bind(this, html))
    html.find('#Theme-revert').click(this.revert.bind(this))
  }

  close () {
    super.close()

    this.expandedSections = []

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
      
      delete this.customThemes[this.selectedTheme]
  
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
    const confirmed = !this.isPresetTheme
      ? await Dialog.confirm({
          title: localizer('CP.ChangeThemeConfirmTitle'),
          content: localizer('CP.ChangeThemeConfirmContent'),
          defaultYes: false,
        })
      : true

    if (confirmed) {
      this.selectedTheme = event.currentTarget.value
  
      await this.render(true)
    }
  }

  async onDisplayToggle (event) {
    const { section } = event.currentTarget.dataset

    this.expandedSections = this.expandedSections.includes(section)
      ? this.expandedSections
        .filter(expandedSection => expandedSection !== section)
      : [...this.expandedSections, section]

    displayToggleMethod.call(event.target, event)
  }

  preview (html) {
    const formData = Object.fromEntries(new FormData(html[0]).entries())

    const expandedData = expandObject(formData)

    Log('CpThemeSettings.preview expandedData:', expandedData)

    const {
      selectedTheme,
      currentSettings,
    } = expandedData

    setThemeProperties (
      presetThemes[selectedTheme] ?? currentSettings
    )
  }

  async revert () {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.RevertThemeConfirmTitle'),
      content: localizer('CP.RevertThemeConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
      const themeSettings = game.settings.get('cortexprime', 'themes')

      this.selectedTheme = themeSettings.selectedTheme

      setThemeProperties()
      this.render(true)
    }
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

    Dialog.prompt({
      title: localizer('CP.PromptThemeSaveTitle'),
      content: localizer('CP.PromptThemeSaveContent'),
    })
  }
}

// TODO:
// change transparent to be "leave empty"
// keep scroll position when changing theme (on re-render)
// Image file picker field
// fix layout of theme settings page
// Fix listing traits in RollResult! (showing side by side)
// Fix Multiple Effect Dice in RollResult! (showing one over the other)
// Relook at, finalize, and refactor colors and other styles
// // Heading 1 and 2 for regular cortex prime theme needs some adjusting