export class CpItemSheet extends ItemSheet {
  get item () {
    return super.item
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item-sheet', 'item-sheet--asset'],
      width: 960,
      height: 900,
    })
  }
 
  getData (options) {
    return super.getData(options)
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}
