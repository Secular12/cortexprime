import Logger from '../../lib/Logger.js'
import { localizer } from '../scripts/foundryHelpers.js'

export default class CpGeneralSettings extends FormApplication {
  constructor() {
    super()
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'general-settings', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'general-settings',
      left: 400,
      resizable: true,
      submitOnChange: true,
      submitOnClose: true,
      template: 'systems/cortexprime/system/templates/CpGeneralSettings.html',
      title: localizer('GeneralSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')
    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')
    
    Logger('warn', 'assert')
      (actorTypeSettings.types.length > 0, 'CpGeneralSettings.getData: There are no actor types')
    Logger('warn', 'assert')
      (itemTypeSettings.types.length > 0, 'CpGeneralSettings.getData: There are no item types')

    Logger('debug')(`CpGeneralSettings.getData actorTypeSettings:`, actorTypeSettings)
    Logger('debug')(`CpGeneralSettings.getData itemTypeSettings:`, itemTypeSettings)
    
    return {
      actorTypeSettings,
      itemTypeSettings
    }
  }

  async _updateObject(event, formData) {
  }
}