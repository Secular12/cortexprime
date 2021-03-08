/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

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
      height: 1000,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "traits" }]
    })
  }

  getData () {
    const data = super.getData()

    data.settings = {
      hasScaleDie: game.settings.get('cortexprime', 'majorCharacterScale'),
      hasStress: game.settings.get('cortexprime', 'hasStress'),
      hasTrauma: game.settings.get('cortexprime', 'hasTrauma')
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
    html.find('.add-new-trauma').click(async event => await this._addNewSimpleTrait(event, this.actor.data.data.trauma, 'trauma', 'New Trauma'))
    html.find('.add-pp').click(() => { this.actor.getPp() })
    html.find('.add-trait-to-pool').click(this._addTraitToPool.bind(this))
    html.find('.clear-dice-pool').click(this._clearDicePool.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.remove-asset').click(async event => await this._removeSimpleTrait(event, this.actor.data.data.assets, '', 'assets'))
    html.find('.remove-complication').click(async event => await this._removeSimpleTrait(event, this.actor.data.data.complications, '', 'complications'))
    html.find('.remove-detail').click(this._removeDetail.bind(this))
    html.find('.remove-pool-trait').click(this._removePoolTrait.bind(this))
    html.find('.remove-signature-asset').click(async event => await this._removeSimpleTrait(event, this.actor.data.data.signatureAssets, '', 'signatureAssets'))
    html.find('.remove-signature-asset-detail').click(this._removeSignatureAssetDetail.bind(this))
    html.find('.remove-stress').click(async event => await this._removeSimpleTrait(event, this.actor.data.data.stress, '', 'stress'))
    html.find('.remove-trait').click(this._removeTrait.bind(this))
    html.find('.remove-trauma').click(async event => await this._removeSimpleTrait(event, this.actor.data.data.trauma, '', 'trauma'))
    html.find('.reset-custom-pool-trait').click(this._resetCustomPoolTrait.bind(this))
    html.find('.roll-dice-pool').click(this._rollDicePool.bind(this))
    html.find('.spend-pp').click(() => {
      this.actor
        .spendPp()
        .then(() => {
          if (game.dice3d) {
            game.dice3d.show({ throws: [{ dice: [{ result: 1, resultLabel: 1, type: 'dp', vectors: [], options: {} }] }] })
          }
        })
    })
    html.find('.toggle-signature-asset-shutdown').click(this._toggleSignatureAssetShutdown.bind(this))
    html.find('.toggle-trait-shutdown').click(this._toggleShutdown.bind(this))
    html.find('.toggle-trait-set-shutdown').click(this._toggleShutdown.bind(this))
    html.find('.toggle-simple-trait-edit').click(this._toggleSimpleTraitEdit.bind(this))
    html.find('.toggle-trait-edit').click(this._toggleTraitEdit.bind(this))
    html.find('.toggle-trait-set-edit').click(this._toggleTraitSetEdit.bind(this))
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

    await this._addNewDataPoint(data, target, value)
  }

  async _addNewDataPoint(data, path, value) {
    const currentData = data || {}

    await this.actor.update({
      [`data.${path}`]: {
        ...currentData,
        [Object.keys(currentData).length]: value
      }
    })
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

    await this._addNewDataPoint(trait.details, `traitSets.${traitSetKey}.traits.${traitKey}.details`, value)
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

    await this._addNewDataPoint(this.actor.data.data.signatureAssets, 'signatureAssets', value)
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

    await this._addNewDataPoint(signatureAsset.details, `signatureAssets.${signatureAssetKey}.details`, value)
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

    await this._addNewDataPoint(traitSet.traits, `traitSets.${traitSetKey}.traits`, value)
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

  async _clearDicePool(event) {
    event.preventDefault()

    await this._resetDataPoint('data.dice', 'pool', {})
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

      const newValue =

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

  async _removeSimpleTrait(event, data, path, target) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const targetKey = $button.data('key').toString()
    await this._removeDataPoint(data, path, target, targetKey)
  }

  async _removeDataPoint (data, path, target, key) {
    const currentData = data || {}

    const newData = Object.keys(currentData)
      .reduce((acc, currentKey) => {
        if (currentKey !== key) {
          return { ...acc, [Object.keys(acc).length]: currentData[currentKey] }
        }

        return acc
      }, {})

    await this._resetDataPoint(`data${path ? '.' + path : ''}`, target, newData)
  }

  async _removeDetail(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const traitSetKey = $button.data('traitSet').toString()
    const traitKey = $button.data('trait').toString()
    const detailKey = $button.data('detail').toString()

    await this._removeDataPoint(this.actor.data.data.traitSets[traitSetKey].traits[traitKey].details, `traitSets.${traitSetKey}.traits.${traitKey}`, 'details', detailKey)
  }

  async _removePoolTrait(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const targetKey = $button.data('key').toString()
    await this._removeDataPoint(this.actor.data.data.dice.pool, 'dice', 'pool', targetKey)
  }

  async _removeSignatureAssetDetail(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const signatureAssetKey = $button.data('signatureAsset').toString()
    const detailKey = $button.data('detail').toString()

    await this._removeDataPoint(this.actor.data.data.signatureAssets[signatureAssetKey].details, `signatureAssets.${signatureAssetKey}`, 'details', detailKey)
  }

  async _removeTrait(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const targetSetKey = $button.data('setKey').toString()
    const targetKey = $button.data('key').toString()
    await this._removeDataPoint(this.actor.data.data.traitSets[targetSetKey].traits, `traitSets.${targetSetKey}`, 'traits', targetKey)
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

  async _toggleSimpleTraitEdit(event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const simpleTraitType = $target.data('simpleTraitType')
    const simpleTraitKey = $target.data('simpleTrait')

    await this.actor.update({
      [`data.${simpleTraitType}.${simpleTraitKey}.edit`]: !this.actor.data.data[simpleTraitType][simpleTraitKey].edit
    })
  }

  async _toggleTraitEdit(event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const traitSetKey = $target.data('traitSet')
    const traitKey = $target.data('trait')

    await this.actor.update({
      [`data.traitSets.${traitSetKey}.traits.${traitKey}.edit`]: !this.actor.data.data.traitSets[traitSetKey].traits[traitKey].edit
    })
  }

  async _toggleTraitSetEdit (event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const traitSetKey = $target.data('traitSet')

    await this.actor.update({
      [`data.traitSets.${traitSetKey}.edit`]: !this.actor.data.data.traitSets[traitSetKey].edit
    })
  }

  async _toggleShutdown (event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const traitKey = $target.data('traitKey')
    const traitSetKey = $target.data('traitSetKey')

    const target = traitKey || traitKey === 0
      ? `data.traitSets.${traitSetKey}.traits.${traitKey}.shutdown`
      : `data.traitSets.${traitSetKey}.shutdown`

    const value = traitKey || traitKey === 0
      ? !this.actor.data.data.traitSets[traitSetKey].traits[traitKey].shutdown
      : !this.actor.data.data.traitSets[traitSetKey].shutdown

    await this.actor.update({
      [target]: value
    })
  }

  async _toggleSignatureAssetShutdown(event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const signatureAssetKey = $target.data('signatureAssetKey')
    const value = !this.actor.data.data.signatureAssets[signatureAssetKey].shutdown

    await this.actor.update({
      [`data.signatureAssets.${signatureAssetKey}.shutdown`]: value
    })
  }
}
