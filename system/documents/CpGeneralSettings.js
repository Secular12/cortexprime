import Logger from '../../lib/Logger.js'
import { arrayMove, localizer, sort } from '../scripts/foundryHelpers.js'

export default class CpGeneralSettings extends FormApplication {
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
      template: 'systems/cortexprime/system/templates/CpGeneralSettings.html',
      title: localizer('GeneralSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')
    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')
    
    Logger('warn', 'assert')
      (actorTypeSettings.types.length > 0, 'CpGeneralSettings.getData: There are no actor types')
    Logger('warn', 'assert')
      (itemTypeSettings.types.length > 0, 'CpGeneralSettings.getData: There are no item types')

    Logger('debug')(`CpGeneralSettings.getData actorTypeSettings:`, actorTypeSettings)
    Logger('debug')(`CpGeneralSettings.getData itemTypeSettings:`, itemTypeSettings)
    
    return {
      actorTypeSettings,
      itemTypeSettings
    }
  }

  async _updateObject(event, formData) {
  }

  activateListeners(html) {
    super.activateListeners(html)
    
    Logger('verbose')('CpGeneralSettings.activateListeners html:', html)

    const dragDropActorTypes = new DragDrop({
      dragSelector: '.item-type-list-item',
      dropSelector: '.item-types-list',
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
    Logger('verbose')('CpGeneralSettings._onDragStartTypes event:', event)

    const { typeId } = event.target.dataset

    const settingType = event.target.classList.contains('actor-type-list-item')
      ? 'actorTypes'
      : 'itemTypes'

    event.dataTransfer.setData('text/plain', JSON.stringify({ settingType, typeId }))
  }

  _onDragDropTypes (event) {
    Logger('verbose')('CpGeneralSettings._onDragDropTypes event:', event)

    const { typeId: toId } = event.target.dataset

    const { settingType, typeId: fromId } = JSON.parse(event.dataTransfer.getData('text'))

    if (fromId === toId) return

    this._reorderTypes({ fromId, toId, type: settingType })
  }

  async _reorderTypes({ fromId, toId, type }) {
    Logger('debug')('CpGeneralSettings._reorderTypes fromId, toId, type:', fromId, toId, type)

    const typeSettings = game.settings.get('cortexprime', type)

    const fromIndex = typeSettings.types.findIndex(type => type.id === fromId)
    const toIndex = typeSettings.types.findIndex(type => type.id === toId)

    const types = arrayMove(typeSettings.types, fromIndex, toIndex)

    setProperty(typeSettings, 'types', types)

    await game.settings.set('cortexprime', type, typeSettings)
    this.render(true)
  }
}