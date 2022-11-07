export class CpItemSheet extends ItemSheet {
  get item () {
    return super.item
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item-sheet'],
      height: 900,
      template: "systems/cortexprime/system/templates/CpItemSheet.html",
      width: 960,
    })
  }
 
  getData (options) {
    return super.getData(options)
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}
