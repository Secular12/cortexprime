import { CpActorSheet } from './CpActorSheet.js'
import Logger from '../../lib/Logger.js'

export class CpActorCharacterSheet extends CpActorSheet {
  get actor () {
    return super.actor
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor-sheet', 'actor-sheet--character'],
      template: "systems/cortexprime/system/templates/CpActorCharacterSheet.html",
    })
  }
 
  getData (options) {
    const data = super.getData(options)
    const actorTypes = game.settings.get('cortexprime', 'actorTypes')
    const characterTypes = actorTypes.characters
    
    if (!data.data.system.characterType) {
      Logger('warn', 'assert')
        (characterTypes?.length > 0, 'CpActorSheet.getData: There are no character type options')
      
      data.characterTypeOptions = characterTypes
    }

    Logger('debug')(`CpActorSheet.getData data:`, data)

    return data
  }

  activateListeners (html) {
    super.activateListeners(html)

    html
      .find('#character-type-confirm')
      .click(this._characterTypeConfirm.bind(this))
  }

  async _characterTypeConfirm (event) {
    const actorTypes = game.settings.get('cortexprime', 'actorTypes')
    const characterTypes = actorTypes.characters
    const characterTypeIndex = $('#character-type-select').val()

    const characterType = characterTypes[characterTypeIndex]

    await this.actor.update({
      'system.characterType': characterType.name
    })
  }
}
