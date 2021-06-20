/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import { objectMapValues } from '../../lib/helpers.js'
import {
  removeItems,
  toggleItems
} from '../scripts/sheetHelpers.js'

export class CortexPrimeActorSheet extends ActorSheet {

  get actor () {
    return super.actor
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cortexprime", "sheet", "actor"],
      template: "systems/cortexprime/templates/actor/actor-sheet.html",
      width: 900,
      height: 900,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "traits" }]
    })
  }

  getData (options) {
    const data = super.getData(options)

    console.log(data)

    return {
      ...data,
      actorTypeOptions: objectMapValues(game.settings.get('cortexprime', 'actorTypes'), val => val.name)
    }
  }

  /* -------------------------------------------- */
  /** @override */
  activateListeners (html) {
    super.activateListeners(html)
    html.find('.actor-type-confirm').click(this._actorTypeConfirm.bind(this))
    html.find('.add-new-tag').click(this._addNewTag.bind(this))
    html.find('.add-pp').click(() => { this.actor.changePpBy(1) })
    html.find('.add-to-pool').click(this._addToPool.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.spend-pp').click(() => {
      this.actor
        .changePpBy(-1)
        .then(() => {
          if (game.dice3d) {
            game.dice3d.show({ throws: [{ dice: [{ result: 1, resultLabel: 1, type: 'dp', vectors: [], options: {} }] }] }, game.user, true)
          }
        })
    })
    removeItems.call(this, html)
    toggleItems.call(this, html)
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */

  async _actorTypeConfirm (event) {
    event.preventDefault
    const actorTypes = game.settings.get('cortexprime', 'actorTypes')
    const actorTypeIndex = $('.actor-type-select').val()

    const actorType = actorTypes[actorTypeIndex]

    await this.actor.update({
      'data.actorType': actorType,
      'data.pp.value': actorType.hasPlotPoints ? 1 : 0
    })
  }

  async _addNewTag (event) {
    event.preventDefault()
    const $addButton = $(event.currentTarget)
    const path = $addButton.data('path')
    const currentTagData = getProperty(this.actor.data, path)
    const currentTags = currentTagData.value ?? {}
    const newIndex = Object.keys(currentTags).length
    const newTags = { ...currentTags, [newIndex]: currentTagData.newTagValue }

    await this.actor.update({
      [path]: {
        newTagValue: '',
        value: newTags
      }
    })
  }

  async _addToPool (event) {
    const { path, label } = event.currentTarget.dataset
    const value = getProperty(this.actor.data, `${path}.value`)
    await game.cortexprime.UserDicePool._addTraitToPool(this.actor.name, label, value)
  }

  async _newDie (event) {
    event.preventDefault()
    const $targetNewDie = $(event.currentTarget)
    const target = $targetNewDie.data('target')
    const currentDiceData = getProperty(this.actor.data, target)
    const currentDice = currentDiceData.value ?? {}
    const dataTargetValue = Object.values(currentDice)
    const newIndex = dataTargetValue.length
    const newValue = dataTargetValue[newIndex - 1] || '8'

    await this.actor.update({
      [target]: {
        value: {
          ...currentDice,
          [newIndex]: newValue
        }
      }
    })
  }

  async _onDieChange (event) {
    event.preventDefault()
    const $targetNewDie = $(event.currentTarget)
    const target = $targetNewDie.data('target')
    const targetKey = $targetNewDie.data('key')
    const targetValue = $targetNewDie.val()
    const currentDiceData = getProperty(this.actor.data, target)
    const currentDice = currentDiceData.value ?? {}
    const currentDiceValues = Object.values(currentDice)

    const newValue = currentDiceValues.reduce((acc, value, index) => {
      return targetValue === '0'
        ? index !== targetKey
          ? { ...acc, [Object.keys(acc).length]: value }
          : acc
        : { ...acc, [index]: index === targetKey ? targetValue : value }
    }, {})

    await this._resetDataPoint(target, 'value', newValue)
  }

  async _resetDataPoint(path, target, value) {
    await this.actor.update({
      [`${path}.-=${target}`]: null
    })

    await this.actor.update({
      [`${path}.${target}`]: value
    })
  }
}
