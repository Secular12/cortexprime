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
    html.find('.spend-pp').click(() => {
      this.actor
        .changePpBy(-1)
        .then(() => {
          if (game.dice3d) {
            game.dice3d.show({ throws: [{ dice: [{ result: 1, resultLabel: 1, type: 'dp', vectors: [], options: {} }] }] })
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
    const currentTagSettings = getProperty(this.actor.data, path)
    const currentTags = currentTagSettings.value ?? {}
    const newIndex = Object.keys(currentTags).length
    const newTags = { ...currentTags, [newIndex]: currentTagSettings.newTagValue }

    await this.actor.update({
      [path]: {
        newTagValue: '',
        value: newTags
      }
    })
  }
}
