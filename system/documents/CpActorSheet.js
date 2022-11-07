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
 
  getData (options) {
    const data = super.getData(options)
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')

    Logger('debug')('CpActorSheet.getData actorTypes', actorTypeSettings)
    
    if (!data.data.system.actorType.id) {
      const actorTypes = actorTypeSettings.types
        .map(({ id, title }) => ({ id, title }))

      Logger('warn', 'assert')
        (actorTypes?.length > 0, 'CpActorSheet.getData: There are no actor type options')

      data.actorTypeOptions = actorTypes
    } else {
      const matchingActorType = actorTypeSettings.types
        .find(type => type.id === data.data.system.actorType.id)

      data.sets = matchingActorType.sets
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
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')
    const actorTypes = actorTypeSettings.types
      .map(({ id, title }) => ({ id, title }))

    const actorTypeId = $('#actor-type-select').val()

    const actorType = actorTypes.find(type => type.id === actorTypeId)

    await this.actor.update({
      'system.actorType': actorType
    })
  }
}
