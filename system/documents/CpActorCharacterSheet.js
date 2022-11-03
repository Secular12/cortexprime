import Logger from '../../lib/Logger.js'

export class CpActorCharacterSheet extends ActorSheet {
  get actor () {
    return super.actor
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'character-sheet'],
      template: "systems/cortexprime/system/templates/CpActorCharacterSheet.html",
      width: 960,
      height: 900,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'traits' }]
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
