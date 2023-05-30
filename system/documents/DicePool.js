import { diceSelectListener, fieldListeners } from '../lib/formHelpers.js'
import { localizer, objectToArray } from '../lib/helpers.js'
import Logger from '../lib/Logger'
import rollDice from '../lib/rollDice.js'

const Log = Logger()

const getBlankCustomAdd = () => ({
  dice: [8],
  hasHitches: true,
  parentName: null,
  name: '',
  rollsSeparately: false,
})

export class DicePool extends FormApplication {
  constructor () {
    super()

    this.customAdd = getBlankCustomAdd()

    this.pool = []
    this.rollMode = game.settings.get('core', 'rollMode')
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'DicePool'],
      closeOnSubmit: false,
      height: 'auto',
      id: 'DicePool',
      left: 20,
      resizable: false,
      submitOnClose: true,
      submitOnChange: true,
      template: 'systems/cortexprime/system/templates/DicePool.html',
      title: localizer('CP.DicePool'),
      top: 500,
      width: 480
    })
  }

  getData () {
    const data = {
      customAdd: this.customAdd,
      pool: this.pool,
      poolIsEmpty: this.poolIsEmpty,
      rollMode: this.rollMode,
      rollModes: [
          { name: localizer('CP.PublicRoll'), value: 'publicroll' },
          { name: localizer('CP.PrivateGmRoll'), value: 'gmroll' },
          { name: localizer('CP.BlindGmRoll'), value: 'blindroll' },
          { name: localizer('CP.SelfRoll'), value: 'selfroll' },
      ],
    }

    Log('DicePool.getData data:', data)

    return data
  }

  _updateObject (event, formData) {
    const expandedData = expandObject(formData)

    this.customAdd = {
      ...this.customAdd,
      ...expandedData.customAdd,
    }

    this.rollMode = expandedData.rollMode

    Log(
      'DicePool._updateObject event, expandedData, this.rollMode:',
      event,
      expandedData,
      this.rollMode,
    )
  }

  activateListeners (html) {
    super.activateListeners(html)
    fieldListeners(html)
    diceSelectListener(
      html,
      this.onAddDie.bind(this),
      this.onChangeDie.bind(this),
      this.onRemoveDie.bind(this),
    )

    html
      .find('#DicePool-add-custom-trait')
      .click(this.addCustomTrait.bind(this))
    
    html
      .find('#DicePool-clear')
      .click(() => {
        this.clear()
        this.render(true)
      })
    
    html
      .find('.DicePool-remove-trait')
      .click(this.removeTrait.bind(this))
    
    html
      .find('#DicePool-reset-custom-trait')
      .click(this.resetCustomTrait.bind(this))
    
    html
      .find('#DicePool-roll-effect')
      .click(() => this._rollDice.call(this, 'effect'))
    
    html
      .find('#DicePool-roll-select')
      .click(() => this._rollDice.call(this, 'select'))
    
    html
      .find('#DicePool-roll-total')
      .click(() => this._rollDice.call(this, 'total'))

    html
      .find('#DicePool-rolls-separately')
      .change(event => this._onRollsSeparatelyChange.call(this, event, html))
  }

  get poolIsEmpty() {
    return this.pool
      .reduce((isEmpty, sourceGroup) => {
        if (!isEmpty) return false
        return !((sourceGroup?.traits?.length ?? 0) > 0)
      }, true)
  }

  _getTargetTrait(event) {
    const trait = event.currentTarget.closest('.DicePool-trait')

    const {
      sourceIndex,
      traitIndex
    } = trait.dataset

    return this.pool[sourceIndex].traits[traitIndex]
  }

  _getTraitByTarget(event, target) {
    return target === 'customAdd'
      ? this.customAdd
      : target === 'trait'
        ? this._getTargetTrait(event)
        : null
  }

  async _rollDice (rollType) {
    event.preventDefault()

    Log('DicePool._rollDice this.pool, rollType:', this.pool, rollType)

    await rollDice.call(this, this.pool, rollType, this.rollMode)
  }

  _onRollsSeparatelyChange (event, html) {
    const $target = $(event.currentTarget)
    const isRolledSeparately = $target.prop('checked')

    const $hasHitchesCheckbox = html
    .find('#DicePool-has-hitches')

    $hasHitchesCheckbox
      .prop('disabled', !isRolledSeparately)
      .prop('checked', !isRolledSeparately)

    $hasHitchesCheckbox
      .closest('.field-checkbox')
      .toggleClass('field-disabled')
  }

  async addCustomTrait (event) {
    event.preventDefault()

    const matchingSourceIndex = this.pool
      .findIndex(sourceGroup => sourceGroup.source === 'Custom')

    if (matchingSourceIndex < 0) {
      this.pool = [...this.pool, {
        source: 'Custom',
        traits: [this.customAdd]
      }]
    } else {
      this.pool[matchingSourceIndex].traits = [
        ...this.pool[matchingSourceIndex].traits,
        this.customAdd,
      ]
    }

    this.resetCustomTrait()
  }

  addToPool (event) {
    const $addToPoolButton = $(event.currentTarget)
    const $rollResult = $addToPoolButton.closest('.RollResult')

    this.pool = Array.from($rollResult.find('.RollResult-source'))
      .map(sourceGroup => ({
        source: sourceGroup.dataset.source ?? null,
        traits: Array.from($(sourceGroup).find('.RollResult-trait'))
          .map(trait => ({
            dice: Array.from($(trait).find('.cp-die .number'))
              .map(number => parseInt(number.innerText, 10)),
            hasHitches: trait.dataset.hasHitches ?? false,
            name: trait.dataset.name ?? null,
            parentName: trait.dataset.parentName ?? null,
            rollsSeparately: trait.dataset.rollsSeparately !== 'false'
          }))
      }))
  }

  clear () {
    this.customAdd = getBlankCustomAdd()

    this.pool = []
  }

  async onAddDie (event, { target }) {
    const targetTrait = this._getTraitByTarget(event, target)

    targetTrait.dice = [
      ...targetTrait.dice,
      targetTrait.dice[targetTrait.dice.length - 1] ?? 8
    ]

    await this.render(true)
  }

  async onChangeDie (event, { index, target, value }) {
    const targetTrait = this._getTraitByTarget(event, target)

    targetTrait.dice = targetTrait.dice.map((die, dieIndex) => {
      return dieIndex === index ? value : die
    })

    await this.render(true)
  }

  async onRemoveDie (event, { index, target }) {
    const targetTrait = this._getTraitByTarget(event, target)

    targetTrait.dice = targetTrait.dice
      .filter((die, dieIndex) => dieIndex !== index)

    await this.render(true)
  }

  async removeTrait (event) {
    const trait = event.currentTarget.closest('.DicePool-trait')

    const {
      sourceIndex,
      traitIndex
    } = trait.dataset

    this.pool[sourceIndex].traits = this.pool[sourceIndex].traits
      .filter((trait, index) => index !== parseInt(traitIndex, 10))

    await this.render(true)
  }

  async resetCustomTrait(event) {
    if (event) event.preventDefault()

    this.customAdd = getBlankCustomAdd()

    await this.render(true)
  }

  async toggle () {
    if (!this.rendered) {
      await this.render(true)
    } else {
      this.close()
    }
  }
}
