import Logger from '../../lib/Logger.js'

export class CpActorSheet extends ActorSheet {
  get actor () {
    return super.actor
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor-sheet'],
      height: 900,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'traits' }],
      template: "systems/cortexprime/system/templates/CpActorSheet.html",
      width: 960,
    })
  }
 
  async getData (options) {
    const superData = super.getData(options)
    
    Logger('debug')(`CpActorSheet.getData superData:`, superData)
    
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')

    Logger('debug')('CpActorSheet.getData actorTypes', actorTypeSettings)

    const data = this._getActorData(superData, actorTypeSettings)

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
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')
    const actorTypes = actorTypeSettings.types
      .map(({ id, title }) => ({ id, title }))

    const actorTypeId = $('#actor-type-select').val()

    const actorType = actorTypes.find(type => type.id === actorTypeId)

    await this.actor.update({
      'system.actorType': actorType
    })
  }

  _getActorData (data, actorTypeSettings) {
    if (!data.data.system.actorType.id) {
      data.actorTypeOptions = actorTypeSettings.types
        .map(({ id, title }) => ({ id, title }))
    } else {
      const matchingActorType = actorTypeSettings.types
          .find(type => type.id === data.data.system.actorType.id)
  
      data.sets = matchingActorType.sets
    }

    return data
  }
}