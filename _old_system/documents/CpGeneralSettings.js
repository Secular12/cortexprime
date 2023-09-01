import Logger from '../../lib/Logger.js'
import { arrayMove, localizer, sort } from '../scripts/foundryHelpers.js'

export default class CpItemSettings extends FormApplication {
  constructor() {
    super()
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'general-settings', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'general-settings',
      left: 400,
      resizable: true,
      submitOnChange: true,
      submitOnClose: true,
      template: 'systems/cortexprime/system/templates/CpItemSettings.html',
      title: localizer('ItemSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')
    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')
    
    Logger('warn', 'assert')
      (actorTypeSettings.types.length > 0, 'CpItemSettings.getData: There are no actor types')
    Logger('warn', 'assert')
      (itemTypeSettings.types.length > 0, 'CpItemSettings.getData: There are no item types')

    Logger('debug')(`CpItemSettings.getData actorTypeSettings:`, actorTypeSettings)
    Logger('debug')(`CpItemSettings.getData itemTypeSettings:`, itemTypeSettings)
    
    return {
      actorTypeSettings,
      itemTypeSettings
    }
  }

  async _updateObject(event, formData) {
  }

  activateListeners(html) {
    super.activateListeners(html)
    
    Logger('verbose')('CpItemSettings.activateListeners html:', html)

    const dragDropActorTypes = new DragDrop({
      dragSelector: '.actor-type-list-item',
      dropSelector: '.actor-types-list',
      callbacks: {
        dragstart: this._onDragStartTypes.bind(this),
        drop: this._onDragDropTypes.bind(this),
      }
    })

    dragDropActorTypes.bind(html[0])

    const dragDropItemTypes = new DragDrop({
      dragSelector: '.item-type-list-item',
      dropSelector: '.item-types-list',
      callbacks: {
        dragstart: this._onDragStartTypes.bind(this),
        drop: this._onDragDropTypes.bind(this),
      }
    })

    dragDropItemTypes.bind(html[0])
  }

  _onDragStartTypes (event) {
    Logger('verbose')('CpItemSettings._onDragStartTypes event:', event)

    const { typeId } = event.target.dataset

    const settingType = event.target.classList.contains('actor-type-list-item')
      ? 'actorTypes'
      : 'itemTypes'

    event.dataTransfer.setData('text/plain', JSON.stringify({ settingType, typeId }))
  }

  _onDragDropTypes (event) {
    Logger('verbose')('CpItemSettings._onDragDropTypes event:', event)

    const { typeId: toId } = event.target.dataset

    const { settingType, typeId: fromId } = JSON.parse(event.dataTransfer.getData('text'))

    if (fromId === toId) return

    this._reorderTypes({ fromId, toId, type: settingType })
  }

  async _reorderTypes({ fromId, toId, type }) {
    Logger('debug')('CpItemSettings._reorderTypes fromId, toId, type:', fromId, toId, type)

    const typeSettings = game.settings.get('cortexprime', type)

    const fromIndex = typeSettings.types.findIndex(type => type.id === fromId)
    const toIndex = typeSettings.types.findIndex(type => type.id === toId)

    const types = arrayMove(typeSettings.types, fromIndex, toIndex)

    setProperty(typeSettings, 'types', types)

    await game.settings.set('cortexprime', type, typeSettings)
    this.render(true)
  }
}