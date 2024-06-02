import { localizer } from '../scripts/foundryHelpers.js'
import { getLength, objectFilter, objectMapValues, objectReindexFilter } from '../../lib/helpers.js'
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
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'user-dice-pool',
      template: 'systems/cortexprime/templates/dice-pool.html',
      title: localizer('DicePool'),
      classes: ['cortexprime', 'user-dice-pool'],
      width: 600,
      height: 'auto',
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
    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]
    return { ...dice, theme }
  }

  async _updateObject (event, formData) {
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const newDice = foundry.utils.mergeObject(currentDice, foundry.utils.expandObject(formData))

    await game.user.setFlag('cortexprime', 'dicePool', newDice)
  }

  activateListeners (html) {
    html.find('.add-trait-to-pool').click(this._addCustomTraitToPool.bind(this))
    html.find('.clear-dice-pool').click(this._clearDicePool.bind(this))
    html.find('.new-die').click(this._onNewDie.bind(this))
    html.find('.custom-dice-label').change(this.submit.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.die-select').on('mouseup', this._onDieRemove.bind(this))
    html.find('.remove-pool-trait').click(this._removePoolTrait.bind(this))
    html.find('.reset-custom-pool-trait').click(this._resetCustomPoolTrait.bind(this))
    html.find('.roll-dice-pool').click(this._rollDicePool.bind(this))
    html.find('.clear-source').click(this._clearSource.bind(this))
  }

  async initPool () {
    await game.user.setFlag('cortexprime', 'dicePool', null)
    await game.user.setFlag('cortexprime', 'dicePool', this.dicePool)
  }

  async _addCustomTraitToPool (event) {
    event.preventDefault()

    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const currentCustomLength = getLength(currentDice.pool.custom ?? {})

    foundry.utils.setProperty(currentDice, `pool.custom.${currentCustomLength}`, currentDice.customAdd)

    foundry.utils.setProperty(currentDice, `customAdd`, {
      label: '',
      value: { 0: '8' }
    })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _addTraitToPool (source, label, value) {
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const currentDiceLength = getLength(currentDice.pool[source] || {})
    foundry.utils.setProperty(currentDice, `pool.${source}.${currentDiceLength}`, { label, value })

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

  async _clearSource (event) {
    event.preventDefault()
    const { source } = event.currentTarget.dataset
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')

    await game.user.setFlag('cortexprime', 'dicePool', null)

    currentDice.pool = objectFilter(currentDice.pool, (_, dieSource) => source !== dieSource)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _onDieChange (event) {
    event.preventDefault()
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const $targetDieSelect = $(event.currentTarget)
    const target = $targetDieSelect.data('target')
    const targetKey = $targetDieSelect.data('key')
    const targetValue = $targetDieSelect.val()
    const dataTargetValue = foundry.utils.getProperty(currentDice, `${target}.value`) || {}

    await this.submit()

    await game.user.setFlag('cortexprime', 'dicePool', null)

    foundry.utils.setProperty(currentDice, `${target}.value`, objectMapValues(dataTargetValue, (value, index) => parseInt(index, 10) === parseInt(targetKey, 10) ? targetValue : value))

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _onDieRemove (event) {
    event.preventDefault()

    if (event.button === 2) {
      const currentDice = game.user.getFlag('cortexprime', 'dicePool')
      const $targetDieSelect = $(event.currentTarget)
      const target = $targetDieSelect.data('target')
      const targetKey = $targetDieSelect.data('key')
      const dataTargetValue = foundry.utils.getProperty(currentDice, `${target}.value`) || {}

      await this.submit()

      await game.user.setFlag('cortexprime', 'dicePool', null)

      foundry.utils.setProperty(currentDice, `${target}.value`, objectReindexFilter(dataTargetValue, (_, index) => parseInt(index, 10) !== parseInt(targetKey, 10)))

      await game.user.setFlag('cortexprime', 'dicePool', currentDice)

      await this.render(true)
    }
  }

  async _onNewDie (event) {
    event.preventDefault()
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')
    const $targetNewDie = $(event.currentTarget)
    const target = $targetNewDie.data('target')
    const dataTargetValue = foundry.utils.getProperty(currentDice, `${target}.value`) || {}
    const currentLength = getLength(dataTargetValue)
    const lastValue = dataTargetValue[currentLength - 1] || '8'

    foundry.utils.setProperty(currentDice, `${target}.value`, { ...dataTargetValue, [currentLength]: lastValue })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _removePoolTrait (event) {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const source = $target.data('source')
    let currentDicePool = game.user.getFlag('cortexprime', 'dicePool')

    if (getLength(currentDicePool.pool[source] || {}) < 2) {
      delete currentDicePool.pool[source]
    } else {
      delete currentDicePool.pool[source][$target.data('key')]
      currentDicePool.pool[source] = objectReindexFilter(currentDicePool.pool[source], (_, index) => parseInt(index, 10) !== parseInt($target.data('key'), 10))
    }

    await game.user.setFlag('cortexprime', 'dicePool', null)
    await game.user.setFlag('cortexprime', 'dicePool', currentDicePool)

    this.render(true)
  }

  async _resetCustomPoolTrait (event) {
    event.preventDefault()

    const currentDice = game.user.getFlag('cortexprime', 'dicePool')

    foundry.utils.setProperty(currentDice, 'customAdd', {
      label: '',
      value: { 0: '8' }
    })

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _setPool (pool) {
    const currentDice = game.user.getFlag('cortexprime', 'dicePool')

    foundry.utils.setProperty(currentDice, 'pool', pool)

    await game.user.setFlag('cortexprime', 'dicePool', null)

    await game.user.setFlag('cortexprime', 'dicePool', currentDice)

    await this.render(true)
  }

  async _rollDicePool (event) {
    event.preventDefault()
    const $target = $(event.currentTarget)

    const currentDicePool = game.user.getFlag('cortexprime', 'dicePool')

    const dicePool = currentDicePool.pool

    const rollType = $target.hasClass('roll-for-total')
      ? 'total'
      : $target.hasClass('roll-for-effect')
        ? 'effect'
        : 'select'

    await rollDice.call(this, dicePool, rollType)
  }

  async toggle () {
    if (!this.rendered) {
      await this.render(true)
    } else {
      this.close()
    }
  }
}