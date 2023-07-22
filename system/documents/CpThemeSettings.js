import { fieldListeners } from '../lib/formHelpers'
import { addListeners, displayToggleMethod, localizer } from '../lib/helpers'
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
      classes: ['cortexprime', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ThemeSettings',
      left: 400,
      resizable: false,
      scrollY: ['#ThemeSettings-form-body'],
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
    
    const [$html] = html
    
    fieldListeners($html)

    addListeners(
      $html,
      '.field-hidden-image-picker',
      'change',
      this.onImageChange
    )

    addListeners(
      $html,
      '.image-remove',
      'click',
      this.removeImage
    )

    addListeners(
      $html,
      'input.color,input[type="color"]',
      'change',
      this.onColorChange
    )

    addListeners(
      $html,
      '.display-toggle',
      'click',
      this.onDisplayToggle.bind(this)
    )

    $html
      .querySelector('#ThemeSettings-theme-select')
      ?.addEventListener('change', this.onChangeTheme.bind(this))
    
    $html
      .querySelector('#ThemeSettings-custom-theme-create')
      ?.addEventListener('click', () => this.createCustomTheme.call(this, $html))

    $html
      .querySelector('#ThemeSettings-delete')
      ?.addEventListener('click', this.deleteTheme.bind(this))

    $html
      .querySelector('#ThemeSettings-preview')
      ?.addEventListener('click', this.preview.bind(this, html))

    $html
      .querySelector('#ThemeSettings-revert')
      ?.addEventListener('click', this.revert.bind(this))
  }

  close () {
    super.close()

    this.expandedSections = []

    setThemeProperties()
  }

  async createCustomTheme ($html) {
    const customThemeName = (
      $html
        .querySelector('#ThemeSettings-custom-theme-name')
        .value ?? ''
      ).trim()

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
    const $currentTarget = event.currentTarget
    const confirmed = !this.isPresetTheme
      ? await Dialog.confirm({
          title: localizer('CP.ChangeThemeConfirmTitle'),
          content: localizer('CP.ChangeThemeConfirmContent'),
          defaultYes: false,
        })
      : true

    if (confirmed) {
      this.selectedTheme = $currentTarget.value
  
      await this.render(true)
    }
  }

  onColorChange (event) {
    const $input = event.target
    const $fieldColor = $input.closest('.field-color')

    const $swatch = $fieldColor
      .querySelector('.swatch')

    const value = $input.value

    const $pickerField = $fieldColor
      .querySelector('input[type="color"]')

    $pickerField.value = value

    $swatch.style.backgroundColor = value || '#ffffff'

    const hasTransparentClass = $swatch.classList.contains('transparent')

    if (
      (value && hasTransparentClass) ||
      (!value && !hasTransparentClass)
    ) {
      $swatch.classList.toggle('transparent')
    }
  }

  async onDisplayToggle (event) {
    const { section } = event.currentTarget.dataset

    this.expandedSections = this.expandedSections.includes(section)
      ? this.expandedSections
        .filter(expandedSection => expandedSection !== section)
      : [...this.expandedSections, section]

    displayToggleMethod(event)
  }

  onImageChange (event) {
    const value = event.target.value

    const $fieldWrapper = event
      .target
      .closest('.field-wrapper')

    const $imageRemove = $fieldWrapper
      .querySelector('.image-remove')

    const $noImageMsg = $fieldWrapper
      .querySelector('.no-image-msg')

    $fieldWrapper
      .querySelector('.field-hidden-image-picker')
      .value = value

    $fieldWrapper
      .querySelector('.field-img')
      .style
      .backgroundImage = value ? `url('${value}')` : ''

    if (value) {
      $imageRemove.classList.remove('hide')
  
      $noImageMsg.classList.add('hide')
    } else {
      $imageRemove.classList.add('hide')

      $noImageMsg.classList.remove('hide')
    }

    $fieldWrapper
      .querySelector('.field-img-value')
      .textContent = value || localizer('CP.NoImage')
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

  removeImage (event) {
    const $fieldWrapper = event
      .target
      .closest('.field-wrapper')

    $fieldWrapper
      .querySelector('.field-img')
      .style.backgroundImage = null

    $fieldWrapper
      .querySelector('.field-hidden-image-picker')
      .value = ''

    $fieldWrapper
      .querySelector('.image-remove')
      .classList
      .add('hide')

    $fieldWrapper
      .querySelector('.no-image-msg')
      .classList
      .remove('hide')

    $fieldWrapper
      .querySelector('.field-img-value')
      .textContent = localizer('CP.NoImage')
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
