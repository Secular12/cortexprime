import { CpItemSheet } from './CpItemSheet.js'

export class CpItemAssetSheet extends CpItemSheet {
  get item () {
    return super.item
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item-sheet', 'item-sheet--asset'],
      template: "systems/cortexprime/system/templates/CpItemAssetSheet.html",
    })
  }
 
  getData (options) {
    const data = super.getData(options)

    return data
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}