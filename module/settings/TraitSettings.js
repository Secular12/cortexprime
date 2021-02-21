import createNewFieldElements from '../scripts/createNewFieldElements.js'
import isBetween from '../scripts/isBetween.js'

export default class TraitSettings extends FormApplication {
  constructor(object = {}, options = { parent: null }) {
    super(object, options);
    this.config = CONFIG.CP.traitSettingsConfig;
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: CONFIG.CP.traitSettingsConfig.id,
      template: 'systems/cortexprime/templates/trait-settings.html',
      title: game.i18n.localize('CortexPrime.TraitSettingsT'),
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

  // @TODO: Add Order Sorting capabilities

  activateListeners (html) {
    super.activateListeners(html)

    html.find('#add-trait-set').click(this._addTraitSet.bind(this))
    html.find('.collapse-toggle').click(this._collapseToggle.bind(this))
    html.find('input.display-toggle').change(event => this._displayToggle(event, html))
    html.find('button.display-toggle').click(event => this._displayToggle(event, html))
    html.find('.remove-parent-element').click(this._removeParentElement.bind(this))
    html.find('.add-trait').click(this._addTrait.bind(this))
    html.find('#reset').click(event => this._resetSettings(event))
    html.find('#submit').click(() => this.close())
    // html.find('.die-select').change(event => this._onTraitDieChange(event))
    // html.find('.new-die').click(this._newTraitDie.bind(this))
  }

  getData () {
    // @TODO: If never used, remove from CONFIG.CP.traitSettingsConfig and all other commented out areas in this file
    // const settingRules = this.config.traitSettingsConfig.reduce((acc, setting) => {
    //   return { ...acc, [setting]: game.settings.get('cortexprime', setting) }
    // }, {})
    const traitSets = game.settings.get('cortexprime', 'traitSets')

    return {
      // settingRules
      traitSets
    }
  }

  async _updateObject (_, formData) {
    const expandedFormData = expandObject(formData)
    const traitSets = game.settings.get('cortexprime', 'traitSets')

    const mergedTraitSets = this._mergeTraitSets(expandedFormData.traitSets, traitSets)

    // const traitSetsUpdated = this._handleTraitSetsUpdate(expandedFormData.traitSets, traitSets)
    // const mergedTraitSets = this._handleDeletableAttributes(traitSetsUpdated, traitSets)

    if (expandedFormData.newTraitSet) {
      const currentTraitSetLength = Object.keys(mergedTraitSets).length

      const saveValue = {
        ...mergedTraitSets,
        [currentTraitSetLength]: {
          ...expandedFormData.newTraitSet,
          traits: {}
        }
      }

      await game.settings.set('cortexprime', 'traitSets', saveValue)
    } else if (expandedFormData.newTrait) {
      const currentTraitLength = Object.keys(mergedTraitSets[expandedFormData.newTrait.traitSet]?.traits || {}).length

      const {
        description,
        dice,
        name
      } = expandedFormData.newTrait

      const saveValue = {
        ...mergedTraitSets,
        [expandedFormData.newTrait.traitSet]: {
          ...mergedTraitSets[expandedFormData.newTrait.traitSet],
          traits: {
            ...mergedTraitSets[expandedFormData.newTrait.traitSet].traits,
            [currentTraitLength]: { description, details: {}, dice: { values: dice }, name }
          }
        }
      }
      await game.settings.set('cortexprime', 'traitSets', saveValue)
    } else {
      await game.settings.set('cortexprime', 'traitSets', mergedTraitSets)
    }

  }

  async _addTrait (event) {
    event.preventDefault()
    const dataset = event.currentTarget.dataset
    const $form = this.form
    const traitSet = game.settings.get('cortexprime', 'traitSets')[dataset.traitSet]

    const $newTraitFields = createNewFieldElements([
      { name: 'newTrait.description', type: 'text', value: '' },
      { name: 'newTrait.name', type: 'text', value: `New ${traitSet.name} Trait` },
      { name: 'newTrait.traitSet', type: 'text', value: dataset.traitSet },
      { name: 'newTrait.dice', type: 'number', value: [8] }
    ])

    $form.append($newTraitFields)
    await this._onSubmit(event)
    this.render(true)
  }

  async _addTraitSet (event) {
    event.preventDefault()
    const $form = this.form

    const $newTraitSetFields = createNewFieldElements([
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
    ])

    $form.append($newTraitSetFields)
    await this._onSubmit(event)
    this.render(true)
  }

  _displayToggle (event, html) {
    event.preventDefault()
    const dataset = event.currentTarget.dataset
    if (dataset.scope) {
      $(event.currentTarget)
        .closest(dataset.scope)
        .find(dataset.selector)
        .toggle()
    } else {
      html.find(dataset.selector).toggle()
    }
  }

  async _collapseToggle (event) {
    event.preventDefault()
    const $element = $(event.currentTarget)
    const $collapseValue = $element
      .next('.collapse-value')

    $collapseValue.prop('checked', !($collapseValue.is(':checked')))

    await this._onSubmit(event)
    this.render(true)
  }

  _getDefaultTraitDieRating (traitSet) {
    const traitSetData = game.settings.get('cortexprime', 'traitSets')

    const maxDieRating = parseInt(traitSetData[traitSet].maxDieRating || 12)
    const minDieRating = parseInt(traitSetData[traitSet].minDieRating || 4)

    return [8, 6, 10, 4, 12].reduce((defaultDie, option) => {
      if (!defaultDie && isBetween(option, minDieRating, maxDieRating)) {
        return option
      }

      return defaultDie
    }, null) || 8
  }

  _getTraitDieRatingOptions (traitSet) {
    const traitSetData = game.settings.get('cortexprime', 'traitSets')

    const maxDieRating = parseInt(traitSetData[traitSet].maxDieRating || 12)
    const minDieRating = parseInt(traitSetData[traitSet].minDieRating || 4)

    return [4, 6, 8, 10, 12].filter(x => isBetween(x, minDieRating, maxDieRating))
  }

  /**
   * Remove attributes which are no longer used
   * @param attributes
   * @param base
   */
  _handleDeletableAttributes (attributes, base) {
    for (let k of Object.keys(base)) {
      if (!attributes.hasOwnProperty(k)) {
        delete attributes[k];
      }
    }
    return attributes;
  }

  /**
   * Update attributes and attribute structure
   * @param attributes
   * @param base
   */
  _handleTraitSetsUpdate (attributes, base) {
    // @TODO: Validate min/max dice and die ratings
    // @TODO: Update traits to fulfill any new requirements
    return attributes
      ? Object.keys(attributes).reduce((acc, key) => {
          const { name } = attributes[key]

          if (!name) {
            ui.notifications.error('Trait Set name is required; reverting.')

            $(`input[name="traitSets.${key}.name"]`).val(key)

            return { ...acc, [key]: { ...attributes[key], name: key } }
          }

          if (key === name || !name) return { ...acc, [key]: attributes[key] }

          return { ...acc, [name]: attributes[key] }
        }, {})
      : {}
  }

  _mergeTraitSets (formSets, currentSets) {
    return formSets
      ? Object.keys(formSets).reduce((sets, setKey) => {
        const setsKeys = Object.keys(sets)

        if (setsKeys.every(i => sets[i].name !== formSets[setKey].name)) {
          return {
            ...sets,
            [setsKeys.length]: formSets[setKey]
          }
        }

        return sets
      }, {})
      : {}
  }

  _newDieHtml (traitSet, name, value) {
    const select = `<select class="die-select cp-option d${value}" name="${name}" value="${value}">`
    const options = this._getTraitDieRatingOptions(traitSet).reduce((options, option) => {
      const selected = value === option ? ' selected' : ''
      return `${options}<option value="${option}"${selected}>d${option}</option>`
    }, '<option value="0">X</option>')

    return `${select}${options}</select>`
  }

  _newTraitDie (event) {
    event.preventDefault()
    const $element = $(event.currentTarget)

    const diceLength = $element.parent().find('.die-select').length
    const targetTraitName = $element.data('target')

    const traitSet = targetTraitName.split('.')[1]

    const defaultValue = this._getDefaultTraitDieRating(traitSet)

    const $newDieElement = $(this._newDieHtml(traitSet, `${targetTraitName}.${diceLength}`, defaultValue))

    $element
      .before($newDieElement)

    $newDieElement.change(event => this._onTraitDieChange(event))
  }

  _onTraitDieChange (event) {
    event.preventDefault()
    const $element = event.currentTarget

    if ($element.value === '0') {
      $element.remove()
    }
  }

  async _removeParentElement (event) {
    event.preventDefault()
    const $element = event.currentTarget
    const dataset = $element.dataset
    const $parent = $element.closest(dataset.selector)

    $parent.parentElement.removeChild($parent)
    await this._onSubmit(event)
    this.render(true)
  }

  // async _resetSettings (event) {
  //   for (const setting of this.config.settings) {
  //     const resetValue = game.settings.settings.get(`cortexprime.${setting}`).default

  //     if (game.settings.get('cortexprime', setting) !== resetValue) {
  //       await game.settings.set('cortexprime', setting, resetValue);
  //     }
  //   }
  //   this.render(true)
  // }
}