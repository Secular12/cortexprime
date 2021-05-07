import { localizer } from '../scripts/foundryHelpers.js'
import { objectFindKey, objectMapValues, objectReduce } from '../../lib/helpers.js'
import { addFormElements, removeItem, reorderItem } from '../scripts/settingsHelpers.js'

export default class ActorSettings extends FormApplication {
  constructor(object = {}, options = { parent: null }) {
    super(object, options);
  }

  static get defaultOptions() {
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
      submitOnChange: true,
    })
  }

  getData() {
    return {
      actorTypes: game.settings.get('cortexprime', 'actorTypes'),
      breadcrumbs: game.settings.get('cortexprime', 'actorBreadcrumbs')
    }
  }

  async _updateObject(_, formData) {
    const expandedFormData = expandObject(formData)
    const currentActorTypes = game.settings.get('cortexprime', 'actorTypes') ?? {}

    if (expandedFormData.newActorType) {
      await this._addNewActorType(currentActorTypes, expandedFormData.newActorType)
    } else {
      await game.settings.set('cortexprime', 'actorTypes', mergeObject(currentActorTypes, expandedFormData.actorTypes))
    }
  }

  activateListeners(html) {
    super.activateListeners(html)
    html.find('.add-trait-set').click(this._addTraitSet.bind(this))
    html.find('.breadcrumb:not(.active)').click(this._breadcrumbChange.bind(this))
    html.find('#add-new-actor-type').click(event => addFormElements.call(this, event, this._actorTypeFields))
    html.find('.view-change').click(this._viewChange.bind(this))
    html.find('#submit').click(() => this.close())
    removeItem.call(this, html)
    reorderItem.call(this, html)
  }

  _actorTypeFields () {
    return [
      { name: 'newActorType.name', type: 'text', value: 'New Actor Type' }
    ]
  }

  async _addNewActorType(source, data) {
    const actorTypeKey = Object.keys(source).length
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

  async _addTraitSet (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const actorTypeKey = $(event.currentTarget).data('actorType')
    const newKey = Object.keys(source[actorTypeKey]?.traitSets || {}).length

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
      [Object.keys(currentBreadcrumbs).length]: {
        active: true,
        localize: false,
        name,
        target
      }
    })

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
