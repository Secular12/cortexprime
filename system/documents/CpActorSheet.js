import Logger from '../../lib/Logger.js'

export class CpActorSheet extends ActorSheet {
  get actor () {
    return super.actor
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor-sheet'],
      width: 960,
      height: 900,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'traits' }]
    })
  }
 
  getData (options) {
    return super.getData(options)
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}
