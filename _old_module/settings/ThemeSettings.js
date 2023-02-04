import { localizer, setCssVars } from '../scripts/foundryHelpers.js'
import defaultThemes from '../theme/defaultThemes.js'

export default class ThemeSettings extends FormApplication {
  constructor() {
    super()
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'theme-settings',
      template: 'systems/cortexprime/templates/theme/settings.html',
      title: localizer('ThemeSettings'),
      classes: ['cortexprime', 'theme-settings'],
      width: 960,
      height: 900,
      top: 200,
      left: 400,
      resizable: true,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    })
  }

  getData() {
    const themes = game.settings.get('cortexprime', 'themes')

    return {
      themes,
      defaultVersion: defaultThemes.version
    }
  }

  async _updateObject(event, formData) {
    const expandedFormData = expandObject(formData)
    const currentThemes = game.settings.get('cortexprime', 'themes') ?? {}

    expandedFormData.themes.currentSettings = currentThemes.current !== expandedFormData.themes.current
      ? expandedFormData.themes.current === 'custom'
        ? currentThemes.custom
        : currentThemes.list[expandedFormData.themes.current]
      : expandedFormData.themes.currentSettings

    await game.settings.set('cortexprime', 'themes', mergeObject(currentThemes, expandedFormData.themes))

    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]

    setCssVars(theme)

    this.render(true)
  }

  activateListeners(html) {
    super.activateListeners(html)
    html.find('.image-picker').click(this._changeImage.bind(this))
    html.find('.image-remove').click(this._removeImage.bind(this))
    html.find('.refresh-preset').click(this._refreshPreset.bind(this))
    html.find('.save-as-custom-preset').click(this._saveAsCustomPreset.bind(this))
    html.find('.update-presets').click(this._updatePresets.bind(this))
  }

  async _changeImage (event) {
    event.preventDefault()
    const { targetSetting } = event.currentTarget.dataset
    const source = game.settings.get('cortexprime', 'themes')
    const currentImage = source?.currentSettings?.[targetSetting] || null
    const _this = this

    const imagePicker = await new FilePicker({
      type: 'image',
      current: currentImage,
      async callback (newImage) {
        source.currentSettings[targetSetting] = newImage

        await game.settings.set('cortexprime', 'themes', source)

        _this.render()
      }
    })

    await imagePicker.render()
  }

  async _removeImage (event) {
    event.preventDefault()
    const { targetSetting } = event.currentTarget.dataset
    const source = game.settings.get('cortexprime', 'themes')
    source.currentSettings[targetSetting] = null

    await game.settings.set('cortexprime', 'themes', source)

    this.render()
  }

  async _refreshPreset (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'themes')
    source.currentSettings = source.current === 'custom'
      ? source.custom
      : source.list[source.current]

    await game.settings.set('cortexprime', 'themes', source)

    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]

    setCssVars(theme)

    this.render()
  }

  async _saveAsCustomPreset (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'themes')
    source.current = 'custom'
    source.custom = source.currentSettings

    await game.settings.set('cortexprime', 'themes', source)

    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]

    setCssVars(theme)

    this.render()
  }

  async _updatePresets (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'themes')

    source.current = source.current !== 'custom'
      ? source[source.current] || defaultThemes.current
      : 'custom'
    source.list = defaultThemes.list
    source.version = defaultThemes.version
    source.currentSettings = source.current === 'custom'
      ? source.custom
      : source.list[source.current]

    await game.settings.set('cortexprime', 'themes', source)

    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]

    console.log(theme, themes.current)
    setCssVars(theme)

    this.render()
  }
}
