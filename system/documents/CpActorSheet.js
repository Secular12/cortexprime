import Logger from '../../lib/Logger.js'

export class CpActorSheet extends ActorSheet {
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
      data.actorTypeOptions = ['character']
    }

    Logger('debug')(`CpActorSheet.getData data:`, data)

    return data
  }
}
