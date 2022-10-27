import Logger from '../../lib/Logger.js'

const actorTypes = ['character']

export class CpActorCharacterSheet extends ActorSheet {
  get actor () {
    return super.actor
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor-sheet'],
      template: "systems/cortexprime/system/templates/CpActorSheet.html",
      width: 960,
      height: 900,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'traits' }]
    })
  }
 
  getData (options) {
    const data = super.getData(options)
    
    if (!data.data.system.actorType) {
      data.actorTypeOptions = actorTypes
    }

    Logger('debug')(`CpActorSheet.getData data:`, data)

    return data
  }

  activateListeners (html) {
    super.activateListeners(html)
    html
      .find('#actor-type-confirm')
      .click(this._actorTypeConfirm.bind(this))
  }

  async _actorTypeConfirm (event) {
    const actorTypeIndex = $('#actor-type-select').val()

    const actorType = actorTypes[actorTypeIndex]

    await this.actor.update({
      'system.actorType': actorType
    })
  }
}
