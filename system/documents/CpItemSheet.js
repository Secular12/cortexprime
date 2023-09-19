import Logger from '../lib/Logger.js'

const Log = Logger()

export class CpItemSheet extends ItemSheet {
  get item () {
    return super.item
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item-sheet'],
      height: 450,
      template: "systems/cortexprime/system/templates/CpItemSheet.html",
      width: 480,
    })
  }
 
  async getData (options) {
    const superData = super.getData(options)
    
    Log(`CpItemSheet.getData superData:`, superData)
    
    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

    Log('CpItemSheet.getData itemTypeSettings', itemTypeSettings)

    return {
      ...superData,
      itemTypeSettings
    }
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}
