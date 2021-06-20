import { localizer } from '../scripts/foundryHelpers.js'
import { resetDataObject } from '../../lib/helpers.js'
import {
  addFormElements,
  collapseToggle,
  displayToggle,
  removeParentElements
} from '../scripts/settingsHelpers.js'

export default class TraitSettings extends FormApplication {
  constructor(object = {}, options = { parent: null }) {
    super();
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'traitSettings',
      template: 'systems/cortexprime/templates/trait-settings.html',
      title: localizer('TraitSettingsT'),
      classes: ['cortex-prime', 'trait-settings'],
      width: 600,
      height: 1000,
      top: 200,
      left: 400,
      resizable: true,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true,
    })
  }

  activateListeners (html) {
    super.activateListeners(html)
    html.find('.add-detail').click(event => addFormElements.call(this, event, this._detailFields))
    html.find('.add-trait').click(event => addFormElements.call(this, event, this._traitFields))
    html.find('#add-trait-set').click(event => addFormElements.call(this, event, this._traitSetFields))
    html.find('#submit').click(() => this.close())
    // The below listeners could probably be external to settings but require a bind of 'this'
    collapseToggle.call(this, html)
    displayToggle(html)
    removeParentElements.call(this, html)
  }

  getData () {
    const traitSets = game.settings.get('cortexprime', 'traitSets')

    return {
      traitSets
    }
  }

  async _updateObject (_, formData) {
    const expandedFormData = expandObject(formData)

    const source = expandedFormData.traitSets ?? {}

    if (expandedFormData.newTraitSet) {
      await this._addNewTraitSet(source, expandedFormData.newTraitSet)
    } else if (expandedFormData.newTrait) {
      await this._addNewTrait(source, expandedFormData.newTrait)
    } else if (expandedFormData.newDetail) {
      await this._addNewDetail(source, expandedFormData.newDetail)
    } else {
      const serializedData = expandedFormData.reset ? this._serializeData(expandedFormData) : expandedFormData
      await game.settings.set('cortexprime', 'traitSets', serializedData.traitSets)
    }
  }

  async _addNewDetail(source, { name, traitSet, trait, type, unlocked, value: detailValue }) {
    const detailKey = Object.keys(source[traitSet].traits[trait].details || {}).length

    const value = {
      [traitSet]: {
        traits: {
          [trait]: {
            details: {
              [detailKey]: { name, type, unlocked, value: detailValue }
            }
          }
        }
      }
    }

    await game.settings.set('cortexprime', 'traitSets', mergeObject(source, value))
  }

  async _addNewTrait(source, { description, dice, name, traitSet }) {
    const traitKey = Object.keys(source[traitSet]?.traits || {}).length

    const value = {
      [traitSet]: {
        traits: {
          [traitKey]: {
            description,
            details: {},
            dice: {
              value: dice
            },
            name
          }
        }
      }
    }

    await game.settings.set('cortexprime', 'traitSets', mergeObject(source, value))
  }

  async _addNewTraitSet (source, data) {
    const traitSetKey = [Object.keys(source).length]
    const value = {
      [traitSetKey]: {
        ...data
      }
    }

    await game.settings.set('cortexprime', 'traitSets', mergeObject(source, value))
  }

  _detailFields (dataset) {
    return [
      { name: 'newDetail.name', type: 'text', value: `New Detail` },
      { name: 'newDetail.traitSet', type: 'text', value: dataset.traitSet },
      { name: 'newDetail.trait', type: 'text', value: dataset.trait },
      { name: 'newDetail.type', type: 'text', value: '' },
      { name: 'newDetail.unlocked', type: 'text', value: true },
      { name: 'newDetail.value', type: 'text', value: '' }
    ]
  }

  _serializeData (formData) {
    return resetDataObject({ path: ['traitSets', 'traits', 'details'], source: formData })
  }

  _traitFields (dataset) {
    return [
      { name: 'newTrait.description', type: 'text', value: '' },
      { name: 'newTrait.name', type: 'text', value: `New Trait` },
      { name: 'newTrait.traitSet', type: 'text', value: dataset.traitSet },
      { name: 'newTrait.dice', type: 'number', value: [8] }
    ]
  }

  _traitSetFields () {
    return [
      { name: 'newTraitSet.allowCustomTraits', type: 'checkbox', value: true },
      { name: 'newTraitSet.description', type: 'text', value: '' },
      { name: 'newTraitSet.hasDetails', type: 'checkbox', value: false },
      { name: 'newTraitSet.hasDice', type: 'checkbox', value: true },
      { name: 'newTraitSet.hasLabel', type: 'checkbox', value: false },
      { name: 'newTraitSet.isHidden', type: 'checkbox', value: false },
      { name: 'newTraitSet.maxDice', type: 'number', value: 1 },
      { name: 'newTraitSet.maxDieRating', type: 'number', value: 12 },
      { name: 'newTraitSet.minDice', type: 'number', value: 1 },
      { name: 'newTraitSet.minDieRating', type: 'number', value: 4 },
      { name: 'newTraitSet.name', type: 'text', value: 'New Trait Set' }
    ]
  }
}