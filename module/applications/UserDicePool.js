import { localizer } from '../scripts/foundryHelpers.js'
import { listLength } from '../../lib/helpers.js'
import rollDice from '../scripts/rollDice.js'

const blankPool = {
  customAdd: {
    label: '',
    value: { 0: '8' }
  },
  pool: {}
}

export class UserDicePool extends FormApplication {
  constructor() {
    super()
    let userDicePool = game.user.getFlag('cortexprime', 'dicePool')

    if (!userDicePool) {
      userDicePool = blankPool
    }

    this.dicePool = userDicePool
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'user-dice-pool',
      template: 'systems/cortexprime/templates/dice-pool.html',
      title: localizer('DicePool'),
      classes: ['cortexprime', 'user-dice-pool'],
      width: 600,
      height: 400,
      top: 500,
      left: 20,
      resizable: true,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    })
  }

  async getData () {
    const dice = game.user.getFlag('cortexprime', 'dicePool')

    return dice
  }

  async _updateObject (event, formData) {
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const newDice = mergeObject(currentDice, expandObject(formData))

    await game.user.setFlag('cortexprime', 'dicePool', newDice)
  }

  activateListeners (html) {
    html.find('.add-trait-to-pool').click(this._addCustomTraitToPool.bind(this))
    html.find('.clear-dice-pool').click(this._clearDicePool.bind(this))
    html.find('.new-die').click(this._onNewDie.bind(this))
    html.find('.custom-dice-label').change(this.submit.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.remove-pool-trait').click(this._removePoolTrait.bind(this))
    html.find('.reset-custom-pool-trait').click(this._resetCustomPoolTrait.bind(this))
    html.find('.roll-dice-pool').click(this._rollDicePool.bind(this))
  }

  async initPool () {
    await game.user.setFlag('cortexprime', 'dicePool', null)
    await game.user.setFlag('cortexprime', 'dicePool', this.dicePool)
  }

  async _addCustomTraitToPool (event) {
    event.preventDefault()

    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const currentCustomLength = Object.keys(currentDice.pool.custom || {}).length

    setProperty(currentDice, `pool.custom.${currentCustomLength}`, currentDice.customAdd)

    setProperty(currentDice, `customAdd`, {
      label: '',
      value: { 0: '8' }
    })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _addTraitToPool (source, label, value) {
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const currentDiceLength = Object.keys(currentDice.pool[source] || {}).length
    setProperty(currentDice, `pool.${source}.${currentDiceLength}`, { label, value })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _clearDicePool (event) {
    if (event) event.preventDefault()

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', blankPool)

    await this.render(true)
  }

  async _onDieChange (event) {
    event.preventDefault()
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const $targetDieSelect = $(event.currentTarget)
    const target = $targetDieSelect.data('target')
    const targetKey = $targetDieSelect.data('key')
    const targetValue = $targetDieSelect.val()
    const dataTargetValue = Object.values(getProperty(currentDice, `${target}.value`) || {})

    await this.submit()

    await game.user.setFlag('cortexprime', 'dicePool', null)

    if ($targetDieSelect.val() === '0') {
      $targetDieSelect.remove()

      setProperty(currentDice, `${target}.value`, dataTargetValue.reduce((acc, value, index) => {
        if (index !== targetKey) {
          return { ...acc, [Object.keys(acc).length]: value }
        }

        return acc
      }, {}))
    } else {
      setProperty(currentDice, `${target}.value`, dataTargetValue.reduce((acc, value, index) => {
        return { ...acc, [index]: index === targetKey ? targetValue : value }
      }, {}))
    }

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _onNewDie (event) {
    event.preventDefault()
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const $targetNewDie = $(event.currentTarget)
    const target = $targetNewDie.data('target')
    const dataTargetValue = Object.values(getProperty(currentDice, `${target}.value`) || {})
    const currentLength = dataTargetValue.length
    const lastValue = dataTargetValue[currentLength - 1] || '8'

    setProperty(currentDice, `${target}.value`, { ...dataTargetValue, [currentLength]: lastValue })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _removePoolTrait (event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const source = $target.data('source')
    const currentDicePool = game.user.getFlag('cortexprime', 'dicePool')

    if (listLength(currentDicePool.pool[source]) < 2) {
      delete currentDicePool.pool[source]
    } else {
      delete currentDicePool.pool[source][$target.data('key')]
    }

    await game.user.setFlag('cortexprime', 'dicePool', null)
    await game.user.setFlag('cortexprime', 'dicePool', currentDicePool)

    this.render(true)
  }

  async _resetCustomPoolTrait (event) {
    event.preventDefault()

    const currentDice = game.user.getFlag('cortexprime', 'dicePool')

    setProperty(currentDice, 'customAdd', {
      label: '',
      value: { 0: '8' }
    })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _setPool (pool) {
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')

    setProperty(currentDice, 'pool', pool)

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _rollDicePool (event) {
    event.preventDefault()

    const currentDicePool = game.user.getFlag('cortexprime', 'dicePool')

    const dicePool = currentDicePool.pool

    await rollDice(dicePool)
  }

  async toggle () {
    if (!this.rendered) {
      await this.render(true)
    } else {
      this.close()
    }
  }
}