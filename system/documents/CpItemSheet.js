import { diceSelectListener, } from '../lib/formHelpers.js'
import {
  localizer,
} from '../lib/helpers.js'
import Logger from '../lib/Logger.js'

const Log = Logger()

export class CpItemSheet extends ItemSheet {
  itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

  get item() {
    return super.item
  }

  get itemTypeProperty() {
    return this.item.type === 'Trait'
      ? 'traits'
      : 'subtraits'
  }

  get itemTypeOptions() {
    return this.itemTypeSettings[this.itemTypeProperty]
  }

  get itemSettings() {
    const itemTypeId = this.item.system?.itemTypeId

    if (!itemTypeId) return null

    return this.itemTypeOptions
      ?.find(({ id, }) => id === itemTypeId) ?? null
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item-sheet',],
      height: 450,
      template: 'systems/cortexprime/system/templates/CpItemSheet.html',
      width: 480,
    })
  }

  async getData(options) {
    const superData = super.getData(options)

    Log('CpItemSheet.getData superData:', superData)

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
        { placeholder: true, id: '', name: localizer('CP.ChooseTypeMessage'), },
        ...this.itemTypeOptions,
      ],
    }

    Log('CpItemSheet.getData data', data)

    return data
  }

  async _updateObject(event, formData) {
    let expandedData = expandObject(formData)

    Log('CPItemSheet._updateObject expandedData:', expandedData)

    const hasItemTypeChanged = expandedData.data.system.itemTypeId
      && expandedData.data.system.itemTypeId !== this.item.system.itemTypeId

    expandedData.data.system.dice = typeof expandedData.data.system.dice === 'string'
      ? [parseInt(expandedData.data.system.dice, 10),]
      : expandedData.data.system.dice
        ? expandedData.data.system.dice.map(die => parseInt(die, 10))
        : []

    if (hasItemTypeChanged) {
      expandedData = this.onItemTypeChange(expandedData)
    }

    const system = foundry.utils.mergeObject(this.item.system, expandedData.data.system)

    Log('CPItemSheet._updateObject system:', system)

    await this.item.update({
      name: expandedData.data.name || this.item.name,
      system,
    })

    await this.render()
  }

  activateListeners(html) {
    super.activateListeners(html)
    const [$html,] = html

    diceSelectListener(
      $html,
      {
        addDie: this.onAddDie.bind(this),
        removeDie: this.onRemoveDie.bind(this),
      }
    )
  }

  async onAddDie() {
    await this.item.update({
      system: {
        ...this.item.system,
        dice: [
          ...this.item.system.dice ?? [],
          this.item.system.dice?.[this.item.system.dice.length -1] ?? this.itemSettings.minDieRating,
        ],
      },
    })

    this.render(true)
  }

  onItemTypeChange(expandedData) {
    const newItemSettings = this.itemTypeOptions
      ?.find(({ id, }) => id === expandedData.data.system.itemTypeId) ?? null

    const dice = expandedData.data.system.dice

    if (newItemSettings.hasDice) {
      expandedData.data.system.dice = dice.length > 0
        ? newItemSettings.allowMultipleDice
          ? dice.map(die => {
            return (
              die > newItemSettings.maxDieRating
                  || die < newItemSettings.minDieRating
            )
              ? newItemSettings.minDieRating
              : die
          })
          : (
            dice[0] > newItemSettings.maxDieRating
                || dice[0] < newItemSettings.minDieRating
          )
            ? [newItemSettings.minDieRating,]
            : [dice[0],]
        : newItemSettings.allowNoDice
          ? dice
          : [newItemSettings.minDieRating,]
    }

    return expandedData
  }

  async onRemoveDie(event, { index, }) {
    await this.item.update({
      system: {
        ...this.item.system,
        dice: this.item.system.dice?.filter((_, i) => i !== index),
      },
    })

    this.render(true)
  }

  // TODO: Create a conformToSettings method
  // // Does checks and if not matching it conforms
  // TODO: Create a serializeDice method
  // // Used for submission
}
