import {
  localizer,
} from '../lib/helpers.js'
import Logger from '../lib/Logger.js'

const Log = Logger()

export class CpItemSheet extends ItemSheet {
  itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

  get item () {
    return super.item
  }

  get itemTypeProperty () {
    return this.item.type === 'Trait'
      ? 'traits'
      : 'subtraits'
  }

  get itemTypeOptions () {
    return this.itemTypeSettings[this.itemTypeProperty]
  }

  get itemSettings () {
    const itemTypeId = this.item.system?.itemTypeId

    if (!itemTypeId) return null
    
    return this.itemTypeOptions
      ?.find(({ id }) => id === itemTypeId) ?? null
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

    Log('CpItemSheet.getData item', this.item)
    
    Log('CpItemSheet.getData itemTypeSettings', this.itemTypeSettings)

    Log('CpItemSheet.getData itemSettings', this.itemSettings)

    Log('CpItemSheet.getData itemTypeOptions', this.itemTypeOptions)

    if (this.item.system.itemTypeId && !this.itemSettings) {
      // TODO: Mismatch! What to do here? (Something like a Compendium item)
    }

    const data = {
      ...superData,
      itemSettings: this.itemSettings,
      itemTypeOptions: [
        { placeholder: true, id: '', name: localizer('CP.ChooseTypeMessage') },
        ...this.itemTypeOptions,
      ]
    }

    Log('CpItemSheet.getData data', data)

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = expandObject(formData)

    Log('CPItemSheet._updateObject expandedData:', expandedData)
    
    const system = mergeObject(this.item.system, expandedData.system)
    
    Log('CPItemSheet._updateObject system:', system)
    this.item.update({ system })

    await this.render()
  }

  activateListeners (html) {
    super.activateListeners(html)
  }
}
