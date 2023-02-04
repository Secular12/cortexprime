import Logger from '../../lib/Logger.js'

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
 
  async getData (options) {
    const superData = super.getData(options)
    
    Logger('debug')(`CpItemSheet.getData superData:`, superData)
    
    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

    Logger('debug')('CpItemSheet.getData itemTypeSettings', itemTypeSettings)

    const data = this._getItemData(superData, itemTypeSettings)

    Logger('debug')(`CpItemSheet.getData data:`, data)

    return data
  }

  activateListeners (html) {
    super.activateListeners(html)

    html
      .find('#item-type-confirm')
      .click(this._itemTypeConfirm.bind(this))
  }

  _getItemData (data, itemTypeSettings) {
    if (!data.data.system.itemTypeId) {
      data.itemTypeOptions = itemTypeSettings.types
        .map(({ id, title }) => ({ id, title }))
    } else {
      const matchingItemType = itemTypeSettings.types
        .find(type => type.id === data.data.system.itemTypeId)

      data.itemType = matchingItemType.title
    }

    return data
  }

  async _itemTypeConfirm (event) {
    await this.item.update({
      'system.itemTypeId': $('#item-type-select').val()
    })
  }
}
