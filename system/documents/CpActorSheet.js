import Logger from '../lib/Logger.js'

const Log = Logger()

export class CpActorSheet extends ActorSheet {
  get actor () {
    return super.actor
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor-sheet'],
      height: 900,
      template: "systems/cortexprime/system/templates/CpActorSheet.html",
      width: 960,
    })
  }
 
  async getData (options) {
    const superData = super.getData(options)
    
    Log(`CpActorSheet.getData superData:`, superData)

    return superData
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}
