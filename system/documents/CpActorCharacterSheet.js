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

    Logger('debug')('CpActorSheet.getData actorTypes', actorTypes)

    const characterTypes = actorTypes.characters
      .map(({ id, title }) => ({ id, title }))

    Logger('warn', 'assert')
      (characterTypes?.length > 0, 'CpActorSheet.getData: There are no character type options')
    
    if (!data.data.system.characterType.id) {
      data.characterTypeOptions = characterTypes
    } else {
      const matchingCharacterType = actorTypes.characters
        .find(type => type.id === data.data.system.characterType.id)

      data.sets = matchingCharacterType.sets
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
      .map(({ id, title }) => ({ id, title }))

    const characterTypeId = $('#character-type-select').val()

    const characterType = characterTypes.find(type => type.id === characterTypeId)

    await this.actor.update({
      'system.characterType': characterType
    })
  }
}
