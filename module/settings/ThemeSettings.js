import { localizer } from '../scripts/foundryHelpers.js'

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
      width: 600,
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
    return {
      themes: game.settings.get('cortexprime', 'themes'),
    }
  }

  async _updateObject() {}

}
