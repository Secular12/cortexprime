import {
  addDragSort,
  dragSort,
} from '../lib/dragSort.js'

import {
  addListeners,
  localizer,
  objectSortToArray,
  uuid,
} from '../lib/helpers.js'

import Logger from '../lib/Logger.js'

const Log = Logger()

export default class CpActorSettings extends FormApplication {
  constructor() {
    super()

    const actorSettings = game.settings.get('cortexprime', 'actorTypes')

    this.actorSettings = actorSettings

    Log('CpActorSettings.constructor actorSettings', actorSettings)
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings', 'actor-settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ActorSettings',
      left: 400,
      resizable: false,
      scrollY: ['#ActorSettings-form-body'],
      submitOnChange: false,
      submitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpActorSettings.html',
      title: localizer('CP.ActorSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const data = this.actorSettings

    Log('CPActorSettings.getData data:', data)

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData)

    Log('CPActorSettings._updateSettings expandedData:', expandedData)

    await this.save(event.target, expandedData)
  }

  activateListeners(html) {
    super.activateListeners(html)
    const [$html] = html

    dragSort($html, this._onDragSortDrop.bind(this, $html))

    addListeners(
      $html,
      '#ActorSettings-main',
      'click',
      event => {
        const $goToPage = event.target.closest('.go-to-page')

        if ($goToPage) {
          this.goToPage(event, $html, $goToPage)

        }
      }
    )

    addListeners(
      $html,
      '.actor-types-list-section',
      'click',
      event => {
        const $addActorType = event.target.closest('.add-actor-type')

        if ($addActorType) {
          this.addActorType($html, $addActorType)
          return
        }

        const $duplicateActorType = event.target.closest('.duplicate-actor-type')

        if ($duplicateActorType) {
          this.duplicateActorType($html, $duplicateActorType)
          return
        }

        const $deleteActorType = event.target.closest('.delete-actor-type')

        if ($deleteActorType) {
          this.deletePageItem($html, $deleteActorType, '.actor-types-list-item')
        }
      }
    )

    addListeners(
      $html,
      '.actor-type-pages',
      'change',
      event => {
        const $actorTypeName = event
          .target
          .closest('.ActorSettings-actor-type-field-name-input')

        if ($actorTypeName) {
          this.updateActorTypeName($html, $actorTypeName)

        }
      }
    )

    $html
      .querySelector('.settings-reset')
      .addEventListener('click', this.reset.bind(this))
  }

  async addActorType($html, $addActorType) {
    const id = uuid()

    await this._addPageItem(
      $html,
      $addActorType,
      {
        id,
        itemName: 'New Actor Type',
        itemsPath: 'actorTypes',
        listTypePlural: 'actor-types',
        listTypeSingular: 'actor-type',
        templatePath: 'ActorSettings/ActorTypePage.html',
        templateData: {
          actorType: {
            id,
            name: 'New Actor Type',
          },
        },
      }
    )

    this._switchPage($html, { targetId: id })
  }

  async close() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.CloseConfirmTitle'),
      content: localizer('CP.CloseConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
      return super.close()
    }
  }

  async deletePageItem($html, $deletePage, parentSelector) {
    const $parentListItem = $deletePage.closest(parentSelector)

    const { id } = $parentListItem.dataset
    const $dragSortList = $parentListItem.closest('.drag-sort-list')

    const listItemName = $parentListItem
      .querySelector('.list-item-name')
      .textContent

    const confirmed = await Dialog.confirm({
      title: localizer('CP.DeleteConfirmTitle'),
      content: `${localizer('CP.DeleteConfirmContentStart')} ${listItemName}?`,
      defaultYes: false,
    })

    if (confirmed) {
      $parentListItem.remove()

      $html
        .querySelector(`.ActorSettings-page[data-id="${id}"]`)
        .remove()

      this._reapplySortSequence($html, $dragSortList)
    }

    return confirmed
  }

  async duplicateActorType($html, $duplicateActorType) {
    const id = uuid()

    const { id: currentId } = $duplicateActorType
      .closest('.actor-types-list-item')
      .dataset

    const $currentActorTypePage = $html
      .querySelector(`.ActorSettings-page[data-id="${currentId}"]`)

    const name = `${$currentActorTypePage
      ?.querySelector(`[name="actorTypes.${currentId}.name"]`)
      ?.value ?? 'New Actor Type'
    } (duplicate)`

    await this._addPageItem(
      $html,
      $duplicateActorType,
      {
        id,
        itemName: name,
        itemsPath: 'actorTypes',
        listTypePlural: 'actor-types',
        listTypeSingular: 'actor-type',
        templatePath: 'ActorSettings/ActorTypePage.html',
        templateData: {
          actorType: {
            id,
            name,
          },
        },
      }
    )

    this._switchPage($html, { targetId: id })
  }

  async goToPage(event, $html, $goToPage) {
    const {
      currentId,
      targetId,
    } = $goToPage?.dataset ?? event.currentTarget.dataset

    this._switchPage($html, { currentId, targetId })
  }

  async reset() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.ResetConfirmTitle'),
      content: localizer('CP.ResetConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
      this.render(true)
    }
  }

  async save($html, expandedData) {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.SaveConfirmTitle'),
      content: localizer('CP.SaveConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
      const sequenceSort = ([_, aValue], [__, bValue]) => {
        const aSortValue = parseInt(aValue.sequence, 10)
        const bSortValue = parseInt(bValue.sequence, 10)

        return bSortValue > aSortValue.sequence
          ? -1
          : aSortValue > bSortValue
            ? 1
            : 0
      }

      const actorTypes = objectSortToArray(expandedData.actorTypes, sequenceSort)
        .map(actorType => {
          delete actorType.sequence

          return actorType
        })

      const serializedData = {
        actorTypes,
      }

      Log('CpActorSettings.save serializedData', serializedData)

      game.settings.set('cortexprime', 'actorTypes', serializedData)

      Dialog.prompt({
        title: localizer('CP.PromptSettingsSaveTitle'),
        content: localizer('CP.PromptSettingsSaveContent'),
      })
    }
  }

  updateActorTypeName($html, $actorTypeName) {
    const $actorTypePage = $actorTypeName.closest('.actor-type-page')

    const { id } = $actorTypePage.dataset

    const actorTypeName = $actorTypeName.value

    $actorTypePage
      .querySelector('.actor-type-page-name')
      .textContent = actorTypeName

    $html
      .querySelector(`.actor-types-list-item[data-id="${id}"] .actor-types-list-item-name`)
      .textContent = actorTypeName
  }

  async _addPageItem($html, $addListButton, payload) {
    const {
      id,
      itemName,
      itemsPath,
      listTypePlural,
      listTypeSingular,
      templatePath,
      templateData,
    } = payload

    const $list = $addListButton
      .closest(`.${listTypePlural}-list-section`)
      .querySelector(`.${listTypePlural}-list`)

    const $listItems = $list
      .querySelectorAll(`.${listTypePlural}-list-item`)

    const sequence = $listItems.length

    const listItemHtml = await renderTemplate(
      'systems/cortexprime/system/templates/partials/SortableListItem.html',
      {
        itemIndex: sequence,
        itemsPath: itemsPath,
        pluralClassAffix: listTypePlural,
        singularClassAffix: listTypeSingular,
        item: {
          id,
          name: itemName,
          sequence: sequence,
        },
      }
    )

    $list.insertAdjacentHTML('beforeend', listItemHtml)

    const $newListItem = $list
      .querySelector(`.${listTypePlural}-list-item[data-sort-sequence="${sequence}"]`)

    const $dragSortHandler = $newListItem
      .querySelector('.drag-sort-handle')

    addDragSort($dragSortHandler, () => this._onDragSortDrop($html, $list))

    const pageHtml = await renderTemplate(
      `systems/cortexprime/system/templates/partials/${templatePath}`,
      templateData
    )

    $html
      .querySelector(`.${listTypeSingular}-pages`)
      .insertAdjacentHTML('beforeend', pageHtml)

    this._switchPage($html, { targetId: id })
  }

  _onDragSortDrop($html, $dragSortList) {
    this._reapplySortSequence($html, $dragSortList)
  }

  _reapplySortSequence($html, $dragSortList) {
    Array.from($dragSortList.children)
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index
        const $dragSortItemSequence = $item
          .querySelector('.drag-sort-item-sequence')

        if ($dragSortItemSequence) {
          $dragSortItemSequence.value = index
        }
      })
  }

  _switchPage($html, { currentId, targetId }) {
    $html
      .querySelector(currentId ? `.ActorSettings-page[data-id="${currentId}"]` : '.list-page')
      .classList
      .add('hide')

    $html
      .querySelector(targetId ? `.ActorSettings-page[data-id="${targetId}"]` : '.list-page')
      .classList
      .remove('hide')
  }
}
