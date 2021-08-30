import { localizer } from '../scripts/foundryHelpers.js'
import { getLength, objectFindKey, objectMapValues, objectReduce, objectReindexFilter } from '../../lib/helpers.js'
import { removeItem, reorderItem } from '../scripts/settingsHelpers.js'

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
    if (!$(event.currentTarget).hasClass('die-select')) {
      const expandedFormData = expandObject(formData)
      const currentActorTypes = game.settings.get('cortexprime', 'actorTypes') ?? {}

      await game.settings.set('cortexprime', 'actorTypes', mergeObject(currentActorTypes, expandedFormData.actorTypes))

      this.render(true)
    }
  }

  activateListeners(html) {
    super.activateListeners(html)
    html.find('#add-new-actor-type').click(this._addNewActorType.bind(this))
    html.find('.add-simple-trait').click(this._addSimpleTrait.bind(this))
    html.find('.add-sfx').click(this._addSfx.bind(this))
    html.find('.add-sub-trait').click(this._addSubTrait.bind(this))
    html.find('.add-trait').click(this._addTrait.bind(this))
    html.find('.add-trait-set').click(this._addTraitSet.bind(this))
    html.find('.breadcrumb-name-change').change(this._breadcrumbNameChange.bind(this))
    html.find('.breadcrumb:not(.active), .go-back').click(this._breadcrumbChange.bind(this))
    html.find('.default-image').click(this._changeDefaultImage.bind(this))
    html.find('.die-select').change(this._onDieChange.bind(this))
    html.find('.die-select').on('mouseup', this._onDieRemove.bind(this))
    html.find('.new-die').click(this._newDie.bind(this))
    html.find('.view-change').click(this._viewChange.bind(this))
    removeItem.call(this, html)
    reorderItem.call(this, html)
  }

  async _addNewActorType(event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const newKey = getLength(source ?? {})

    const newActorType = {
      [newKey]: {
        hasNotesPage: true,
        id: `_${Date.now()}`,
        name: localizer('NewActorType'),
        showProfileImage: true
      }
    }

    await game.settings.set('cortexprime', 'actorTypes', mergeObject(source, newActorType))
    await this.changeView(localizer('NewActorType'), `actorType-${newKey}`)
    this.render(true)
  }

  async _addSfx(event) {
    event.preventDefault()
    const $addButton = $(event.currentTarget)
    const path = $addButton.data('path')
    const source = game.settings.get('cortexprime', 'actorTypes')
    const currentSfx = getProperty(source, path) || {}

    setProperty(source, path,
      {
        ...currentSfx,
        [getLength(currentSfx ?? {})]: {
          description: null,
          label: localizer('NewSfx'),
          unlocked: true
        }
      })

    await game.settings.set('cortexprime', 'actorTypes', source)
    this.render(true)
  }

  async _addSubTrait(event) {
    event.preventDefault()
    const $addButton = $(event.currentTarget)
    const path = $addButton.data('path')
    const source = game.settings.get('cortexprime', 'actorTypes')
    const currentSubTraits = getProperty(source, path) || {}


    setProperty(source, path,
      {
        ...currentSubTraits,
        [getLength(currentSubTraits ?? {})]: {
          dice: { value: { 0: '8' } },
          label: localizer('NewSubTrait')
        }
      })

    await game.settings.set('cortexprime', 'actorTypes', source)
    this.render(true)
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
            id: `_${Date.now()}`,
            label: localizer('NewSimpleTrait'),
            settings: {
              editable: true,
              valueType: 'text'
            }
          }
        }
      }
    }

    await game.settings.set('cortexprime', 'actorTypes', mergeObject(source, newSimpleTrait))
    await this.changeView(localizer('NewSimpleTrait'), `simpleTrait-${actorTypeKey}-${newKey}`)
    this.render(true)
  }

  async _addTrait (event) {
    event.preventDefault()
    const source = game.settings.get('cortexprime', 'actorTypes')
    const { actorType, path, traitSet } = event.currentTarget.dataset
    const currentTraits = getProperty(source, `${path}.${traitSet}.traits`)
    const newKey = getLength(currentTraits || {})

    const newTraits = {
      ...currentTraits,
      [newKey]: {
        id: `_${Date.now()}`,
        name: localizer('NewTrait'),
        dice: {
          value: {
            0: '8'
          }
        }
      }
    }

    setProperty(source, `${path}.${traitSet}.traits`, newTraits)

    await game.settings.set('cortexprime', 'actorTypes', source)
    await this.changeView(localizer('NewTrait'), `trait-${actorType}-${traitSet}-${newKey}`)
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
            id: `_${Date.now()}`,
            label: localizer('NewTraitSet')
          }
        }
      }
    }

    await game.settings.set('cortexprime', 'actorTypes', mergeObject(source, newTraitSet))
    await this.changeView(localizer('NewTraitSet'), `traitSet-${actorTypeKey}-${newKey}`)
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

  async _breadcrumbNameChange (event) {
    const $nameField = $(event.currentTarget)
    const target = $nameField.data('target')
    const currentBreadcrumbs = game.settings.get('cortexprime', 'actorBreadcrumbs')

    await game.settings.set('cortexprime', 'actorBreadcrumbs', {
      ...objectMapValues(currentBreadcrumbs, breadcrumb => {
        if (breadcrumb.target === target) {
          breadcrumb.name = $nameField.val()
        }

        return breadcrumb
      })
    })
  }

  async _changeDefaultImage (event) {
    event.preventDefault()
    const { actorTypeIndex } = event.currentTarget.dataset
    const source = game.settings.get('cortexprime', 'actorTypes')
    const currentImage = source[actorTypeIndex]?.defaultImage || 'icons/svg/mystery-man.svg'
    const _this = this

    const imagePicker = await new FilePicker({
      type: 'image',
      current: currentImage,
      async callback (newImage) {
        source[actorTypeIndex].defaultImage = newImage

        await game.settings.set('cortexprime', 'actorTypes', source)

        _this.render()
      }
    })

    await imagePicker.render()
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

    if (parseInt(targetValue, 10) === 0) {
      setProperty(source, `${target}.value`, objectReindexFilter(currentDiceValues, (_, index) => parseInt(index, 10) !== parseInt(targetKey, 10)))
    } else {
      setProperty(source, `${target}.value`, objectMapValues(currentDiceValues, (value, index) => parseInt(index, 10) === parseInt(targetKey, 10) ? targetValue : value))
    }

    await game.settings.set('cortexprime', 'actorTypes', source)

    await this.render(true)
  }

  async _onDieRemove (event) {
    event.preventDefault()

    if (event.button === 2) {
      const source = game.settings.get('cortexprime', 'actorTypes')
      const $dieSelect = $(event.currentTarget)
      const target = $dieSelect.data('target')
      const targetKey = $dieSelect.data('key')
      const currentDiceValues = getProperty(source, `${target}.value`) ?? {}

      setProperty(source, `${target}.value`, objectReindexFilter(currentDiceValues, (_, index) => parseInt(index, 10) !== parseInt(targetKey, 10)))

      await game.settings.set('cortexprime', 'actorTypes', source)

      await this.render(true)
    }
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
