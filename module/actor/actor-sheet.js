/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class CortexPrimeActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cortexprime", "sheet", "actor"],
      template: "systems/cortexprime/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    })
  }

  /* -------------------------------------------- */
  /** @override */
  activateListeners (html) {
    super.activateListeners(html)
    html.find('.add-pp').click(() => { this.actor.getPp() })
    html.find('.spend-pp').click(() => {
      this.actor
        .spendPp()
        .then(() => {
          if (game.dice3d) {
            game.dice3d.show({ throws: [{ dice: [{ result: 1, resultLabel: 1, type: 'dp', vectors: [], options: {} }] }] })
          }
        })
    })
    html.find('.add-trait-to-pool').click(this._addTraitToPool.bind(this))
    html.find('.clear-dice-pool').click(this._clearDicePool.bind(this))
    html.find('.roll-dice-pool').click(this._rollDicePool.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.remove-pool-trait').click(this._removePoolTrait.bind(this))
    html.find('.reset-custom-pool-trait').click(this._resetCustomPoolTrait.bind(this))
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */

  async _addTraitToPool(event) {
    event.preventDefault()
    const $addDieButton = $(event.currentTarget)
    const traitTarget = $addDieButton.data('traitTarget')
    const dataTarget = getProperty(this.actor.data, traitTarget)
    const currentPool = this.actor.data.data.dice.pool
    const newKey = Object.keys(currentPool).length

    if (traitTarget === 'data.dice.customAdd') {
      await this._resetCustomPoolTrait()
    }

    await this.actor.update({
      'data.dice.pool': {
        ...currentPool,
        [newKey]: dataTarget
      }
    })
  }

  async _clearDicePool(event) {
    event.preventDefault()

    await this.actor.update({
      'data.dice.-=pool': null
    })

    await this.actor.update({
      'data.dice.pool': {}
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
    const dataTargetValue = Object.values(getProperty(this.actor.data, `${target}.values`))

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
        })
      })
    }
  }

  async _newDie(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const target = $button.data('target')
    const data = getProperty(this.actor.data, target)
    const values = Object.values(data.values)

    await this.actor.update({
      [`${target}.values`]: [...values, values.length > 0 ? values[0] : '8']
    })
  }

  async _removePoolTrait(event) {
    event.preventDefault()
    const $button = $(event.currentTarget)
    const targetKey = $button.data('key').toString()

    const currentPool = this.actor.data.data.dice.pool

    const newPool = Object.keys(currentPool).reduce((pool, currentKey) => {
      console.log(currentKey, targetKey, currentKey !== targetKey)
      if (currentKey !== targetKey) {
        return { ...pool, [Object.keys(pool).length]: currentPool[currentKey] }
      }

      return pool
    }, {})

    await this.actor.update({
      [`data.dice.-=pool`]: null
    })

    await this.actor.update({
      [`data.dice.pool`]: newPool
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
