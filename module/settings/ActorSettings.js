import { localizer } from '../scripts/foundryHelpers.js'
import { getLength, objectFindKey, objectMapValues, objectReduce, objectReindexFilter } from '../../lib/helpers.js'
import { addFormElements, removeItem, reorderItem } from '../scripts/settingsHelpers.js'

export default class ActorSettings extends FormApplication {
  constructor() {
    super()
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      id: 'actor-settings',
      template: 'systems/cortexprime/templates/actor/settings.html',
      title: localizer('ActorSettings'),
      classes: ['cortexprime', 'actor-settings'],
      width: 600,
      height: 900,
      top: 200,
      left: 400,
      resizable: true,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    })
  }

  getData() {
    const breadcrumbs = game.settings.get('cortexprime', 'actorBreadcrumbs') ?? {}

    return {
      actorTypes: game.settings.get('cortexprime', 'actorTypes'),
      breadcrumbs,
      goBack: breadcrumbs[getLength(breadcrumbs ?? {}) - 2]?.target ?? 0
    }
  }

  async _updateObject(event, formData) {
    const expandedFormData = expandObject(formData)
    const currentActorTypes = game.settings.get('cortexprime', 'actorTypes') ?? {}

    if (expandedFormData.newActorType) {
      await this._addNewActorType(currentActorTypes, expandedFormData.newActorType)
    } else {
      await game.settings.set('cortexprime', 'actorTypes', mergeObject(currentActorTypes, expandedFormData.actorTypes))
    }

    this.render(true)
  }

  activateListeners(html) {
    super.activateListeners(html)
    html.find('#add-new-actor-type').click(event => addFormElements.call(this, event, this._actorTypeFields))
    html.find('.add-new-tag').click(this._addNewTag.bind(this))
    html.find('.add-simple-trait').click(this._addSimpleTrait.bind(this))
    html.find('.add-trait-set').click(this._addTraitSet.bind(this))
    html.find('.breadcrumb:not(.active), .go-back').click(this._breadcrumbChange.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.view-change').click(this._viewChange.bind(this))
    removeItem.call(this, html)
    reorderItem.call(this, html)
  }

  _actorTypeFields () {
    return [
      { name: 'newActorType.name', type: 'text', value: 'New Actor Type' }
    ]
  }

  async _addNewActorType(source, data) {
    const actorTypeKey = getLength(source ?? {})
    const value = {
      [actorTypeKey]: {
        ...data
      }
    }

    await game.settings.set(
      'cortexprime',
      'actorBreadcrumbs',
      {
        0: {
          active: false,
          name: 'ActorTypes',
          target: 'actorTypes',
          localize: true
        },
        1: {
          active: true,
          name: data.name,
          localize: false,
          target: `actorType-${actorTypeKey}`
        }
      }
    )

    await game.settings.set('cortexprime', 'actorTypes', mergeObject(source, value))
  }

  async _addNewTag (event) {
    event.preventDefault()
    const $addButton = $(event.currentTarget)
    const path = $addButton.data('path')
    const source = game.settings.get('cortexprime', 'actorTypes')
    const currentTags = getProperty(source, path) || {}
    const tagValue = currentTags.newTagValue

    if (tagValue) {
      setProperty(source, `${path}.value`, { ...currentTags.value, [getLength(currentTags.value ?? {})]: tagValue })
      setProperty(source, `${path}.newTagValue`, '')
      await game.settings.set('cortexprime', 'actorTypes', source)
      this.render(true)
    }
  }

  async _addSimpleTrait (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const actorTypeKey = $(event.currentTarget).data('actorType')
    const newKey = getLength(source[actorTypeKey]?.simpleTraits || {})

    const newSimpleTrait = {
      [actorTypeKey]: {
        simpleTraits: {
          [newKey]: {
            dice: {
              value: {
                0: '8'
              }
            },
            editable: true,
            label: 'New Simple Trait'
          }
        }
      }
    }

    await game.settings.set('cortexprime', 'actorTypes', mergeObject(source, newSimpleTrait))
    await this.changeView('New Simple Trait', `simpleTrait-${actorTypeKey}-${newKey}`)
    this.render(true)
  }

  async _addTraitSet (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const actorTypeKey = $(event.currentTarget).data('actorType')
    const newKey = getLength(source[actorTypeKey]?.traitSets || {})

    const newTraitSet = {
      [actorTypeKey]: {
        traitSets: {
          [newKey]: {
            label: 'New Trait Set'
          }
        }
      }
    }

    await game.settings.set('cortexprime', 'actorTypes', mergeObject(source, newTraitSet))
    await this.changeView('New Trait Set', `traitSet-${actorTypeKey}-${newKey}`)
    this.render(true)
  }

  async _breadcrumbChange (event) {
    const currentBreadcrumbs = game.settings.get('cortexprime', 'actorBreadcrumbs')

    const target = $(event.currentTarget).data('to')

    const targetKey = +objectFindKey(currentBreadcrumbs, breadcrumb => breadcrumb.target === target)

    const value = objectReduce(currentBreadcrumbs, (breadcrumbs, breadcrumb, key) => {
      if (+key > targetKey) return breadcrumbs

      breadcrumb.active = breadcrumb.target === target

      return {
        ...breadcrumbs,
        [key]: breadcrumb
      }
    }, {})

    await game.settings.set('cortexprime', 'actorBreadcrumbs', value)

    await this._onSubmit(event)
    this.render(true)
  }

  async changeView (name, target) {
    const currentBreadcrumbs = game.settings.get('cortexprime', 'actorBreadcrumbs')

    await game.settings.set('cortexprime', 'actorBreadcrumbs', {
      ...objectMapValues(currentBreadcrumbs, breadcrumb => {
        breadcrumb.active = false
        return breadcrumb
      }),
      [getLength(currentBreadcrumbs)]: {
        active: true,
        localize: false,
        name,
        target
      }
    })

    this.render(true)
  }

  async _newDie (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const { target: path } = event.currentTarget.dataset
    const currentDice = getProperty(source, path) || {}
    const values = currentDice.value ?? {}
    const newKey = getLength(values)
    const newValue = newKey > 0 ? values[newKey - 1] : '8'

    setProperty(source, `${path}.value`, { ...values, [newKey]: newValue })
    await game.settings.set('cortexprime', 'actorTypes', source)
    this.render(true)
  }

  async _onDieChange (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const $dieSelect = $(event.currentTarget)
    const target = $dieSelect.data('target')
    const targetKey = $dieSelect.data('key')
    const targetValue = $dieSelect.val()
    const currentDiceValues = getProperty(source, `${target}.value`) ?? {}

    if (targetValue === '0') {
      setProperty(source, `${target}.value`, objectReindexFilter(currentDiceValues, (_, index) => parseInt(index, 10) !== parseInt(targetKey, 10)))
    } else {
      setProperty(source, `${target}.value`, objectMapValues(currentDiceValues, (value, index) => parseInt(index, 10) === parseInt(targetKey, 10) ? targetValue : value))
    }

    await game.settings.set('cortexprime', 'actorTypes', source)
    this.render(true)
  }

  async _viewChange (event) {
    event.preventDefault()
    this.changeView($(event.currentTarget).data('name'), $(event.currentTarget).data('to'))
  }
}

Hooks.on('closeActorSettings', async () => {
  await game.settings.set(
    'cortexprime',
    'actorBreadcrumbs',
    {
      0: {
        active: true,
        name: 'ActorTypes',
        target: 'actorTypes',
        localize: true
      }
    }
  )
})
