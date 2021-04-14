/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import {
  addNewDataPoint,
  removeItems,
  resetDataPoint,
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

  getData () {
    const data = super.getData()

    data.settings = {
      hasScaleDie: game.settings.get('cortexprime', 'majorCharacterScale'),
      hasStress: game.settings.get('cortexprime', 'hasStress'),
      hasTrauma: game.settings.get('cortexprime', 'hasTrauma'),
      isGameMasterCharacter: (data.entity.type === 'gmc'),
      isPlayerCharacter: (data.entity.type === 'player-character')
    }

    return data
  }

  /* -------------------------------------------- */
  /** @override */
  activateListeners (html) {
    super.activateListeners(html)

    html.find('.add-new-asset').click(async event => await this._addNewSimpleTrait(event, this.actor.data.data.assets, 'assets', 'New Asset'))
    html.find('.add-new-complication').click(async event => await this._addNewSimpleTrait(event, this.actor.data.data.complications, 'complications', 'New Complication'))
    html.find('.add-new-detail').click(this._addNewDetail.bind(this))
    html.find('.add-new-signature-asset').click(this._addNewSignatureAsset.bind(this))
    html.find('.add-new-signature-asset-detail').click(this._addNewSignatureAssetDetail.bind(this))
    html.find('.add-new-stress').click(async event => await this._addNewSimpleTrait(event, this.actor.data.data.stress, 'stress', 'New Stress'))
    html.find('.add-new-trait').click(this._addNewTrait.bind(this))
    html.find('.add-generic-trait').click(this._addGenericTrait.bind(this))
    html.find('.add-new-trauma').click(async event => await this._addNewSimpleTrait(event, this.actor.data.data.trauma, 'trauma', 'New Trauma'))
    html.find('.add-pp').click(() => { this.actor.changePpBy(1) })
    html.find('.add-trait-to-pool').click(this._addTraitToPool.bind(this))
    html.find('.clear-dice-pool').click(resetDataPoint.bind(this, 'data.dice', 'pool', {}))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.reset-custom-pool-trait').click(this._resetCustomPoolTrait.bind(this))
    removeItems.call(this, html)
    html.find('.roll-dice-pool').click(this._rollDicePool.bind(this))
    html.find('.spend-pp').click(() => {
      this.actor
        .changePpBy(-1)
        .then(() => {
          if (game.dice3d) {
            game.dice3d.show({ throws: [{ dice: [{ result: 1, resultLabel: 1, type: 'dp', vectors: [], options: {} }] }] })
          }
        })
    })
    toggleItems.call(this, html)
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */

  async _addNewSimpleTrait(event, data, target, name, die = 6) {
    event.preventDefault()

    const value = {
      name,
      dice: {
        values: { 0: die }
      }
    }

    await addNewDataPoint.call(this, data, target, value)
  }

  async _addNewDetail(event) {
    event.preventDefault()
    const $addDetailButton = $(event.currentTarget)
    const traitSetKey = $addDetailButton.data('traitSet').toString()
    const traitKey = $addDetailButton.data('trait').toString()
    const trait = this.actor.data.data.traitSets[traitSetKey].traits[traitKey]

    const value = {
      name: '',
      type: '',
      value: ''
    }

    await addNewDataPoint.call(this, trait.details, `traitSets.${traitSetKey}.traits.${traitKey}.details`, value)
  }

  async _addNewSignatureAsset(event) {
    event.preventDefault()

    const value = {
      description: '',
      details: {},
      dice: {
        values: {
          0: 6
        }
      },
      edit: false,
      name: 'New Signature Asset',
      shutdown: false
    }

    await addNewDataPoint.call(this, this.actor.data.data.signatureAssets, 'signatureAssets', value)
  }

  async _addNewSignatureAssetDetail(event) {
    event.preventDefault()
    const $addDetailButton = $(event.currentTarget)
    const signatureAssetKey = $addDetailButton.data('signatureAsset').toString()
    const signatureAsset = this.actor.data.data.signatureAssets[signatureAssetKey]

    const value = {
      name: '',
      type: '',
      value: ''
    }

    await addNewDataPoint.call(this, signatureAsset.details, `signatureAssets.${signatureAssetKey}.details`, value)
  }

  async _addNewTrait (event) {
    event.preventDefault()
    const $addTraitButton = $(event.currentTarget)
    const traitSetKey = $addTraitButton.data('setKey').toString()
    const traitSet = this.actor.data.data.traitSets[traitSetKey]
    const diceValues = { 0: 8 }

    const value = {
      description: '',
      details: {},
      dice: { values: diceValues },
      isCustomTrait: true,
      name: `New ${traitSet.name} Trait`
    }

    await addNewDataPoint.call(this, traitSet.traits, `traitSets.${traitSetKey}.traits`, value)
  }

  async _addGenericTrait (event) {
    event.preventDefault()
    //const $addTraitButton = $(event.currentTarget)
    //console.log($addTraitButton);
    //const traitSetKey = $addTraitButton.data('setKey').toString()
    const diceValues = { 0: 6 }

    const value = {
      description: '',
      details: {},
      dice: { values: diceValues },
      isCustomTrait: true,
      name: `New Trait`
    }

    await addNewDataPoint.call(this, this.actor.data.data.traits, `traits`, value)
  }

  async _addTraitToPool(event) {
    event.preventDefault()
    const $addDieButton = $(event.currentTarget)
    const traitTarget = $addDieButton.data('traitTarget')
    const dataTarget = getProperty(this.actor.data, traitTarget)
    const currentPool = this.actor.data.data.dice.pool
    const newKey = Object.keys(currentPool).length
    const label = $addDieButton.data('label') || ''

    if (traitTarget === 'data.dice.customAdd') {
      await this._resetCustomPoolTrait()
    }

    await this.actor.update({
      'data.dice.pool': {
        ...currentPool,
        [newKey]: dataTarget.dice
          ? { label, values: dataTarget.dice.values }
          : { ...dataTarget, label }
      }
    })
  }

  _getRollFormula(dicePool) {
    return Object.keys(dicePool).reduce((formula, trait) => {
      const innerFormula = Object.keys(dicePool[trait].values)
        .reduce((acc, value) => {
          return `${acc}+d${dicePool[trait].values[value]}`
        }, '')

      return formula ? `${formula}+${innerFormula}` : innerFormula
    }, '')
  }

  async _onDieChange(event) {
    event.preventDefault()
    const $targetDieSelect = $(event.currentTarget)
    const target = $targetDieSelect.data('target')
    const targetKey = $targetDieSelect.data('key')
    const dataTargetValue = Object.values(getProperty(this.actor.data, `${target}.values`) || {})

    if ($targetDieSelect.val() === '0') {
      $targetDieSelect.remove()

      await this.actor.update({
        [`${target}.-=values`]: null
      })

      await this.actor.update({
        [`${target}.values`]: dataTargetValue.reduce((acc, value, index) => {
          if (index !== targetKey) {
            return { ...acc, [index]: value }
          }

          return acc
        }, {})
      })
    } else {
      await this.actor.update({
        [`${target}.values`]: dataTargetValue.reduce((acc, value, index) => {
          return { ...acc, [index]: value }
        }, {})
      })
    }
  }

  async _newDie(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const target = $button.data('target')
    const data = getProperty(this.actor.data, target)
    const values = Object.values(data?.values || {})

    await this.actor.update({
      [`${target}.values`]: [...values, values.length > 0 ? values[0] : '8']
    })
  }

  async _resetDataPoint (path, target, value) {
    await this.actor.update({
      [`${path}.-=${target}`]: null
    })

    await this.actor.update({
      [`${path}.${target}`]: value
    })
  }

  async _resetCustomPoolTrait(event) {
    if (event) {
      event.preventDefault()
    }

    await this.actor.update({
      'data.dice.customAdd.-=values': null
    })

    await this.actor.update({
      'data.dice.customAdd.values': { 0: '8' },
      'data.dice.customAdd.label': ''
    })
  }

  async _rollDicePool(event) {
    event.preventDefault()

    const dicePool = this.actor.data.data.dice.pool

    const rollFormula = this._getRollFormula(dicePool)

    const roll = new Roll(rollFormula).roll()

    if (game.dice3d) {
      await game.dice3d.showForRoll(roll, game.user, true)
    }

    const rollResults = roll.terms
      .filter(term => typeof term !== 'string')
      .map(term => ({ faces: term.faces, result: term.results[0].result }))
      .reduce((acc, result) => {
        if (result.result > 1) {
          return { ...acc, results: [...acc.results, result] }
        }

        return { ...acc, hitches: [...acc.hitches, result] }
      }, { hitches: [], results: [] })

    rollResults.hitches.sort((a, b) => {
      return b.faces - a.faces
    })

    rollResults.results.sort((a, b) => {
      if (a.faces !== b.faces) {
        return b.faces - a.faces
      }

      return b.result - a.result
    })

    const message = await renderTemplate('systems/cortexprime/templates/chat/roll-result.html', {
      rollResults,
      speaker: game.user
    })

    await ChatMessage.create({ content: message })
  }
}
