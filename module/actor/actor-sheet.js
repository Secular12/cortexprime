/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import { getLength, objectMapValues, objectReindexFilter, objectReduce, objectFindValue, objectSort } from '../../lib/helpers.js'
import { localizer } from '../scripts/foundryHelpers.js'
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
    html.find('.update-actor-settings').click(this._updateActorSettings.bind(this))
    html.find('.actor-type-confirm').click(this._actorTypeConfirm.bind(this))
    html.find('.add-pp').click(() => { this.actor.changePpBy(1) })
    html.find('.add-asset').click(this._addAsset.bind(this))
    html.find('.add-complication').click(this._addComplication.bind(this))
    html.find('.add-sfx').click(this._addSfx.bind(this))
    html.find('.add-sub-trait').click(this._addSubTrait.bind(this))
    html.find('.add-to-pool').click(this._addToPool.bind(this))
    html.find('.add-trait').click(this._addTrait.bind(this))
    html.find('.close-trait-set-edit').click(this._closeTraitSetEdit.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.pp-number-field').change(this._ppNumberChange.bind(this))
    html.find('.spend-pp').click(() => {
      this.actor
        .changePpBy(-1)
        .then(() => {
          if (game.dice3d) {
            game.dice3d.show({ throws: [{ dice: [{ result: 1, resultLabel: 1, type: 'dp', vectors: [], options: {} }] }] }, game.user, true)
          }
        })
    })
    html.find('.trait-set-edit').click(this._traitSetEdit.bind(this))
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
    event.preventDefault()
    const actorTypes = game.settings.get('cortexprime', 'actorTypes')
    const actorTypeIndex = $('.actor-type-select').val()

    const actorType = actorTypes[actorTypeIndex]

    await this.actor.update({
      'img': actorType.defaultImage,
      'data.actorType': actorType,
      'data.pp.value': actorType.hasPlotPoints ? 1 : 0
    })
  }

  async _addAsset (event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentAssets = getProperty(this.actor.data, `${path}.assets`) ?? {}

    await this._resetDataPoint(path, 'assets', {
      ...currentAssets,
      [getLength(currentAssets)]: {
        label: localizer('NewAsset'),
        dice: {
          value: {
            0: '6'
          }
        }
      }
    })
  }

  async _addComplication(event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentComplications = getProperty(this.actor.data, `${path}.complications`) ?? {}

    await this._resetDataPoint(path, 'complications', {
      ...currentComplications,
      [getLength(currentComplications)]: {
        label: localizer('NewComplication'),
        dice: {
          value: {
            0: '6'
          }
        }
      }
    })
  }

  async _addSfx (event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentSfx = getProperty(this.actor.data, `${path}.sfx`) ?? {}

    await this._resetDataPoint(path, 'sfx', {
      ...currentSfx,
      [getLength(currentSfx)]: {
        description: null,
        label: localizer('NewSfx'),
        unlocked: true
      }
    })
  }

  async _addSubTrait(event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentSubTraits = getProperty(this.actor.data, `${path}.subTraits`) ?? {}

    await this._resetDataPoint(path, 'subTraits', {
      ...currentSubTraits,
      [getLength(currentSubTraits)]: {
        dice: {
          value: {
            0: '8'
          }
        },
        label: localizer('NewSubTrait')
      }
    })
  }

  async _addToPool (event) {
    const { consumable, path, label } = event.currentTarget.dataset
    let value = getProperty(this.actor.data, `${path}.value`)
    if (consumable) {
      const selectedDice = await this._getConsumableDiceSelection(value, label)

      if (selectedDice.remove?.length) {
        const newValue = objectReindexFilter(value, (_, key) => !selectedDice.remove.map(x => parseInt(x, 10)).includes(parseInt(key, 10)))

        await this._resetDataPoint(path, 'value', newValue)
      }

      value = selectedDice.value
    }

    if (getLength(value)) {
      await game.cortexprime.UserDicePool._addTraitToPool(this.actor.name, label, value)
    }
  }

  async _addTrait (event) {
    const { path } = event.currentTarget.dataset
    const currentCustomTraits = getProperty(this.actor.data, `${path}.customTraits`) ?? {}

    await this._resetDataPoint(path, 'customTraits', {
      ...currentCustomTraits,
      [getLength(currentCustomTraits)]: {
        id: `_${Date.now()}`,
        name: localizer('NewTrait'),
        dice: {
          value: {
            0: '8'
          }
        }
      }
    })
  }

  async _closeTraitSetEdit(event) {
    await this.actor.update({
      ['data.actorType.traitSetEdit']: null
    })
  }

  async _getConsumableDiceSelection (options, label) {
    const diceOptions = Object.values(options ?? {})
      .map((option, index) => `<span class="cursor-pointer die-icon lg result d${option}" data-key="${index}" data-value="${option}"><span class="value">${option}</span></span>`)
      .join('')

    return new Promise((resolve, reject) => {
      new Dialog({
        title: label,
        content: `<div><p class="section-sub-heading text-center">${localizer('SelectDiceToAdd')}</p><div class="flex flex-wrap flex-c">${diceOptions}</div><label><input class="remove-check" type="checkbox"${game.user.isOwner ? ' checked' : ''}><span class="label">${localizer('RemoveSelectedFromSheet')}</span></label></div>`,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: localizer('Cancel'),
            callback () {
              resolve({ remove: [], value: {} })
            }
          },
          done: {
            icon: '<i class="fas fa-check"></i>',
            label: localizer('AddToPool'),
            callback (html) {
              const remove = html.find('.remove-check').prop('checked')
              const selectedDice = html.find('.die-icon.selected').get()

              if (!selectedDice?.length) {
                resolve({ remove: [], value: {} })
              }

              resolve(
                selectedDice
                  .reduce((selectedValues, selectedDie, index) => {
                    const $selectedDie = $(selectedDie)

                    if (remove) {
                      selectedValues.remove = [...selectedValues.remove, $selectedDie.data('key')]
                    }

                    selectedValues.value = { ...selectedValues.value, [getLength(selectedValues.value)]: $selectedDie.data('value') }

                    return selectedValues
                  }, { remove: [], value: {} })
              )
            }
          }
        },
        default: 'cancel',
        render(html) {
          html.find('.die-icon').click(function () {
            $(this).toggleClass('result selected')
          })
        }
      }, { jQuery: true }).render(true)
    })
  }

  async _newDie (event) {
    event.preventDefault()
    const $targetNewDie = $(event.currentTarget)
    const target = $targetNewDie.data('target')
    const currentDiceData = getProperty(this.actor.data, target)
    const currentDice = currentDiceData?.value ?? {}
    const newIndex = getLength(currentDice)
    const newValue = currentDice[newIndex - 1] ?? '8'

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

    const mappedValue = objectMapValues(currentDiceData.value ?? {}, (value, index) => parseInt(index, 10) === targetKey ? targetValue : value)
    const newValue = objectReindexFilter(mappedValue, value => parseInt(value, 10) !== 0)
    await this._resetDataPoint(target, 'value', newValue)
  }

  async _ppNumberChange (event) {
    event.preventDefault()
    const $field = $(event.currentTarget)
    const parsedValue = parseInt($field.val(), 10)
    const currentValue = parseInt(this.actor.data.data.pp.value, 10)
    const newValue = parsedValue < 0 ? 0 : parsedValue
    const changeAmount = newValue - currentValue

    this.actor.changePpBy(changeAmount, true)
  }

  async _resetDataPoint(path, target, value) {
    await this.actor.update({
      [`${path}.-=${target}`]: null
    })

    await this.actor.update({
      [`${path}.${target}`]: value
    })
  }

  async _traitSetEdit(event) {
    const { traitSet } = event.currentTarget.dataset

    await this.actor.update({
      ['data.actorType.traitSetEdit']: traitSet
    })
  }

  async _updateActorSettings(event) {
    event.preventDefault()

    const actorData = this.actor.data.data.actorType
    const actorTypeSettings = objectFindValue(game.settings.get('cortexprime', 'actorTypes'), actorType => actorType.id === actorData.id)

    if (!actorTypeSettings) {
      ui.notifications.error(localizer('MissingActorTypeMessage'))
      return
    }

    const newData = objectMapValues(actorTypeSettings, (propValue, key) => {
      if (key === 'simpleTraits') {
        return objectMapValues(propValue, ({ dice, hasDescription, id, label, settings }) => {
          const matchingSetting = objectFindValue((actorData.simpleTraits ?? {}), ({ id: matchId }) => matchId === id) ?? {}

          return {
            ...matchingSetting,
            dice: {
              ...matchingSetting.dice,
              consumable: dice.consumable
            },
            hasDescription,
            id,
            label,
            settings
          }
        })
      }

      if (key === 'traitSets') {
        return objectMapValues(propValue, ({ hasDescription, id, label, settings, traits }) => {
          const matchingSetting = objectFindValue((actorData.traitSets ?? {}), ({ id: matchId }) => matchId === id) ?? {}

          return {
            ...matchingSetting,
            hasDescription,
            id,
            label,
            settings,
            traits: objectMapValues(traits ?? {}, trait => {
              const matchingTraitSetting = objectFindValue(matchingSetting.traits, ({ id: matchId }) => matchId === trait.id) ?? {}
              return {
                ...matchingTraitSetting,
                id: trait.id,
                name: trait.name
              }
            })
          }
        })
      }

      return propValue
    })
    this._resetDataPoint('data', 'actorType', mergeObject(actorData, newData))
    this.actor.update()
  }
}
