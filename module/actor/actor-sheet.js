/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {foundry.appv1.sheets.ActorSheet}
 */
import { getLength, objectMapValues, objectReindexFilter, objectFindValue, objectSome } from '../../lib/helpers.js'
import { localizer } from '../scripts/foundryHelpers.js'
import {
  removeItems,
  toggleItems
} from '../scripts/sheetHelpers.js'

export class CortexPrimeActorSheet extends foundry.appv1.sheets.ActorSheet {

  get actor () {
    return super.actor
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor', 'actor-sheet'],
      template: "systems/cortexprime/templates/actor/actor-sheet.html",
      width: 960,
      height: 900,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "traits" }]
    })
  }

  getData (options) {
    const data = super.getData(options)
    const themes = game.settings.get('cortexprime', 'themes')
    const theme = themes.current === 'custom' ? themes.custom : themes.list[themes.current]

    return {
      ...data,
      actorTypeOptions: objectMapValues(game.settings.get('cortexprime', 'actorTypes'), val => val.name),
      theme,
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
    html.find('.add-descriptor').click(this._addDescriptor.bind(this))
    html.find('.add-note').click(this._addNote.bind(this))
    html.find('.add-sfx').click(this._addSfx.bind(this))
    html.find('.add-sub-trait').click(this._addSubTrait.bind(this))
    html.find('.add-to-pool').click(this._addToPool.bind(this))
    html.find('.add-trait').click(this._addTrait.bind(this))
    html.find('.close-trait-set-edit').click(this._closeTraitSetEdit.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.die-select').on('mouseup', this._onDieRemove.bind(this))
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
      'system.actorType': actorType,
      'system.pp.value': actorType.hasPlotPoints ? 1 : 0
    })
  }

  async _addAsset (event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentAssets = foundry.utils.getProperty(this.actor, `${path}.assets`) ?? {}

    console.log(path, currentAssets)

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
    const currentComplications = foundry.utils.getProperty(this.actor, `${path}.complications`) ?? {}

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

  async _addDescriptor(event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentDescriptors = foundry.utils.getProperty(this.actor, `${path}.descriptors`) ?? {}

    await this._resetDataPoint(path, 'descriptors', {
      ...currentDescriptors,
      [getLength(currentDescriptors)]: {
        label: localizer('NewDescriptor'),
        value: null
      }
    })
  }

  async _addNote(event) {
    event.preventDefault()
    const currentNotes = this.actor.system.actorType.notes ?? {}

    await this._resetDataPoint('system.actorType', 'notes', {
      ...currentNotes,
      [getLength(currentNotes)]: {
        label: localizer('Notes'),
        value: ''
      }
    })
  }

  async _addSfx (event) {
    event.preventDefault()
    const { path } = event.currentTarget.dataset
    const currentSfx = foundry.utils.getProperty(this.actor, `${path}.sfx`) ?? {}

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
    const currentSubTraits = foundry.utils.getProperty(this.actor, `${path}.subTraits`) ?? {}

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
    let value = foundry.utils.getProperty(this.actor, `${path}.value`)

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
    const currentCustomTraits = foundry.utils.getProperty(this.actor, `${path}.customTraits`) ?? {}

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
      ['system.actorType.traitSetEdit']: null
    })
  }

  async _getConsumableDiceSelection (options, label) {
    const content = await foundry.applications.handlebars.renderTemplate('systems/cortexprime/templates/dialog/consumable-dice.html', {
      options,
      isOwner: game.user.isOwner
    })

    return new Promise((resolve, reject) => {
      new Dialog({ 
        title: label,
        content,
        buttons: {
          cancel: {
            icon: '<i class="fa-solid fa-times"></i>',
            label: localizer('Cancel'),
            callback () {
              resolve({ remove: [], value: {} })
            }
          },
          done: {
            icon: '<i class="fa-solid fa-check"></i>',
            label: localizer('AddToPool'),
            callback (html) {
              const remove = html.find('.remove-check').prop('checked')
              const selectedDice = html.find('.die-select.selected').get()

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
          html.find('.die-select').click(function () {
            const $dieContainer = $(this)
            const $dieCpt = $dieContainer.find('.die-cpt')
            $dieContainer.toggleClass('result selected')
            $dieCpt.toggleClass('unchosen-cpt chosen-cpt')
          })
        }
      }, { jQuery: true, classes: ['dialog', 'consumable-dice', 'cortexprime'] }).render(true)
    })
  }

  async _newDie (event) {
    event.preventDefault()
    const $targetNewDie = $(event.currentTarget)
    const target = $targetNewDie.data('target')
    const currentDiceData = foundry.utils.getProperty(this.actor, target)
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
    const currentDiceData = foundry.utils.getProperty(this.actor, target)

    console.log(target)

    const newValue = objectMapValues(currentDiceData.value ?? {}, (value, index) => parseInt(index, 10) === targetKey ? targetValue : value)

    await this._resetDataPoint(target, 'value', newValue)
  }

  async _onDieRemove (event) {
    event.preventDefault()

    if (event.button === 2) {
      const $target = $(event.currentTarget)
      const target = $target.data('target')
      const targetKey = $target.data('key')
      const currentDiceData = foundry.utils.getProperty(this.actor, target)

      const newValue = objectReindexFilter(currentDiceData.value ?? {}, (_, key) => parseInt(key, 10) !== parseInt(targetKey))

      await this._resetDataPoint(target, 'value', newValue)
    }
  }

  async _ppNumberChange (event) {
    event.preventDefault()
    const $field = $(event.currentTarget)
    const parsedValue = parseInt($field.val(), 10)
    const currentValue = parseInt(this.actor.pp.value, 10)
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
      ['system.actorType.traitSetEdit']: traitSet
    })
  }

  async _updateActorSettings(event) {
    event.preventDefault()

    const actorData = this.actor.system.actorType
    const actorTypeSettings = objectFindValue(game.settings.get('cortexprime', 'actorTypes'), actorType => actorType.id === actorData.id)

    if (!actorTypeSettings) {
      ui.notifications.error(localizer('MissingActorTypeMessage'))
      return
    }

    const newData = {
      ...actorData,
      ...objectMapValues(actorTypeSettings, (propValue, key) => {
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
              description: matchingSetting.description,
              hasDescription,
              id,
              label,
              shutdown: matchingSetting.shutdown,
              settings,
              traits: objectMapValues(traits ?? {}, trait => {
                const matchingTraitSetting = objectFindValue(matchingSetting.traits ?? {}, ({ id: matchId }) => matchId === trait.id) ?? {}
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
    }

    this._resetDataPoint('system', 'actorType', newData)
    this.actor.update()
  }
}
