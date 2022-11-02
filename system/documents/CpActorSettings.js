import Logger from '../../lib/Logger.js'
import { localizer } from '../scripts/foundryHelpers.js'

export default class CpActorSettings extends FormApplication {
  constructor() {
    super()
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'actor-settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'actor-settings',
      left: 400,
      resizable: true,
      submitOnChange: true,
      submitOnClose: true,
      template: 'systems/cortexprime/system/templates/CpActorSettings.html',
      title: localizer('ActorSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const actorTypes = game.settings.get('cortexprime', 'actorTypes')
    
    Logger('warn', 'assert')
      (actorTypes.characters.length > 0, 'CpActorSettings.getData: There are no character types')

    Logger('debug')(`CpActorSettings.getData actorTypes:`, actorTypes)
    
    return actorTypes
  }

  async _updateObject(event, formData) {
  }
}