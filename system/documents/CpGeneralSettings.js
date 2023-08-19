import {
  addDragSort,
  dragSort
} from '../lib/dragSort'

import {
  addListeners,
  displayToggle,
  localizer,
  objectSortToArray,
  uuid
} from '../lib/helpers'

import Logger from '../lib/Logger'

const Log = Logger()

export default class CpGeneralSettings extends FormApplication {
  constructor() {
    super()

    const traitSettings = game.settings.get('cortexprime', 'itemTypes')

    this.traitSettings = traitSettings

    Log('CpGeneralSettings.constructor traitSettings', traitSettings)
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'GeneralSettings',
      left: 400,
      resizable: false,
      scrollY: ['#GeneralSettings-form-body'],
      submitOnChange: false,
      submitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpGeneralSettings.html',
      title: localizer('CP.GeneralSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const data = this.traitSettings

    Log('CPGeneralSettings.getData data:', data)

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = expandObject(formData)

    Log('CPGeneralSettings._updateSettings expandedData:', expandedData)
    
    await this.save(expandedData)
  }

  activateListeners(html) {
    super.activateListeners(html)
    const [$html] = html

    dragSort($html, this._onDragSortDrop.bind(this))

    displayToggle($html)

    addListeners(
      $html,
      '#GeneralSettings-main',
      'click',
      (event) => {
        const $goToPage = event.target.closest('.go-to-page')

        if ($goToPage) {
          this.goToPage(event, $html, $goToPage)
          return
        }
      }
    )

    addListeners(
      $html,
      '.subtraits-list-section',
      'click',
      (event) => {
        const $addSubtrait = event.target.closest('.add-subtrait')

        if ($addSubtrait) {
          this.addSubtrait.call(this, $html, $addSubtrait)
          return
        }

        const $duplicateSubtrait = event.target.closest('.duplicate-subtrait')

        if ($duplicateSubtrait) {
          this.duplicateSubtrait.call(this, $html, $duplicateSubtrait)
          return
        }

        const $deleteSubtrait = event.target.closest('.delete-subtrait')

        if ($deleteSubtrait) {
          this.deletePageItem($html, $deleteSubtrait, '.subtraits-list-item')
        }
      }
    )

    addListeners(
      $html,
      '.traits-list-section',
      'click',
      (event) => {
        const $addTrait = event.target.closest('.add-trait')

        if ($addTrait) {
          this.addTrait.call(this, $html, $addTrait)
          return
        }

        const $duplicateTrait = event.target.closest('.duplicate-trait')

        if ($duplicateTrait) {
          this.duplicateTrait.call(this, $html, $duplicateTrait)
          return
        }

        const $deleteTrait = event.target.closest('.delete-trait')

        if ($deleteTrait) {
          this.deletePageItem($html, $deleteTrait, '.traits-list-item')
        }
      }
    )

    $html
      .querySelector('.settings-refresh')
      .addEventListener('click', this.render.bind(this))
  }

  async addSubtrait ($html, $addSubtrait) {
    const id = uuid()

    await this._addPageItem(
      $html,
      $addSubtrait,
      {
        id,
        itemsPath: 'subtraits',
        itemName: 'New Subtrait',
        listTypePlural: 'subtraits',
        listTypeSingular: 'subtrait',
        templatePath: 'SubtraitPage.html',
        templateData: {
          subtrait: {
            id,
            allowMultipleDice: false,
            hasConsumableDice: false,
            hasDescription: false,
            hasDice: true,
            hasHitches: true,
            hasLabel: false,
            hasTags: false,
            isRolledSeparately: false,
            isUnlockable: false,
            maxDieRating: 12,
            minDieRating: 4,
            name: 'New Subtrait',
          },
        },
      }
    )
  }

  async addTrait ($html, $addTrait) {
    const id = uuid()

    await this._addPageItem(
      $html,
      $addTrait,
      {
        id,
        itemName: 'New Trait',
        itemsPath: 'traits',
        listTypePlural: 'traits',
        listTypeSingular: 'trait',
        templatePath: 'TraitPage.html',
        templateData: {
          trait: {
            id,
            allowMultipleDice: false,
            hasConsumableDice: false,
            hasDescription: false,
            hasDice: true,
            hasHitches: true,
            hasLabel: false,
            hasTags: false,
            isRolledSeparately: false,
            isUnlockable: false,
            maxDieRating: 12,
            minDieRating: 4,
            name: 'New Trait',
            subtraitTypes: [],
          }
        },
      }
    )

    this._switchPage($html, { targetId: id })
  }

  async deletePageItem ($html, $deletePage, parentSelector) {
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

      console.log(id)

      $html
        .querySelector(`.GeneralSettings-page[data-id="${id}"]`)
        .remove()

      this._reapplySortSequence($dragSortList)
    }
  }

  async duplicateSubtrait ($html, $duplicateSubtrait) {
    const id = uuid()
    
    const { id: currentId } = $duplicateSubtrait
      .closest('.subtraits-list-item')
      .dataset

    const $currentSubtraitPage = $html
      .querySelector(`.GeneralSettings-page[data-id="${currentId}"]`)

    const name = (
      $currentSubtraitPage
        ?.querySelector(`[name="subtraits.${currentId}.name"]`)
        ?.value ?? 'New Subtrait'
    ) + ' (duplicate)'

    await this._addPageItem(
      $html,
      $duplicateSubtrait,
      {
        id,
        itemName: name,
        itemsPath: 'subtraits',
        listTypePlural: 'subtraits',
        listTypeSingular: 'subtrait',
        templatePath: 'SubtraitPage.html',
        templateData: {
          subtrait: {
            id,
            allowMultipleDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.allowMultipleDice"]`)
              ?.checked ?? false,
            hasConsumableDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasConsumableDice"]`)
              ?.checked ?? false,
            hasDescription: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasDescription"]`)
              ?.checked ?? false,
            hasDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasDice"]`)
              ?.checked ?? false,
            hasHitches: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasHitches"]`)
              ?.checked ?? false,
            hasLabel: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasLabel"]`)
              ?.checked ?? false,
            hasTags: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasTags"]`)
              ?.checked ?? false,
            isRolledSeparately: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.isRolledSeparately"]`)
              ?.checked ?? false,
            isUnlockable: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.isUnlockable"]`)
              ?.checked ?? false,
            maxDieRating: parseInt(
              $currentSubtraitPage
                ?.querySelector(`[name="subtraits.${currentId}.maxDieRating"]`)
                ?.value ?? null
            , 10) || null,
            minDieRating: parseInt(
              $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.minDieRating"]`)
              ?.value ?? null
            , 10) || null,
            name,
          }
        },
      }
    )

    this._switchPage($html, { targetId: id })
  }

  async duplicateTrait ($html, $duplicateTrait) {
    const id = uuid()
    
    const { id: currentId } = $duplicateTrait
      .closest('.traits-list-item')
      .dataset

    const $currentTraitPage = $html
      .querySelector(`.GeneralSettings-page[data-id="${currentId}"]`)

    const name = (
      $currentTraitPage
        ?.querySelector(`[name="traits.${currentId}.name"]`)
        ?.value ?? 'New Trait'
    ) + ' (duplicate)'

    await this._addPageItem(
      $html,
      $duplicateTrait,
      {
        id,
        itemName: name,
        itemsPath: 'traits',
        listTypePlural: 'traits',
        listTypeSingular: 'trait',
        templatePath: 'TraitPage.html',
        templateData: {
          trait: {
            id,
            allowMultipleDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.allowMultipleDice"]`)
              ?.checked ?? false,
            hasConsumableDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasConsumableDice"]`)
              ?.checked ?? false,
            hasDescription: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasDescription"]`)
              ?.checked ?? false,
            hasDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasDice"]`)
              ?.checked ?? false,
            hasHitches: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasHitches"]`)
              ?.checked ?? false,
            hasLabel: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasLabel"]`)
              ?.checked ?? false,
            hasTags: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasTags"]`)
              ?.checked ?? false,
            isRolledSeparately: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.isRolledSeparately"]`)
              ?.checked ?? false,
            isUnlockable: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.isUnlockable"]`)
              ?.checked ?? false,
            maxDieRating: parseInt(
              $currentTraitPage
                ?.querySelector(`[name="traits.${currentId}.maxDieRating"]`)
                ?.value ?? null
            , 10) || null,
            minDieRating: parseInt(
              $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.minDieRating"]`)
              ?.value ?? null
            , 10) || null,
            name,
          }
        },
      }
    )

    console.log(id)
    this._switchPage($html, { targetId: id })
  }

  async goToPage (event, $html, $goToPage) {
    const {
      currentId,
      targetId
    } = $goToPage?.dataset ?? event.currentTarget.dataset

    this._switchPage($html, { currentId, targetId })
  }

  async save (expandedData) {
    const sequenceSort = ([_, aValue], [__, bValue]) => {
      const aSortValue = parseInt(aValue.sequence, 10)
      const bSortValue = parseInt(bValue.sequence, 10)

      return bSortValue > aSortValue.sequence
        ? -1 
        : aSortValue > bSortValue
          ? 1 
          : 0
    }

    const subtraits = objectSortToArray(expandedData.subtraits, sequenceSort)
      .map(subtrait => {
        delete subtrait.sequence

        return subtrait
      })

    const traits = objectSortToArray(expandedData.traits, sequenceSort)
      .map(trait => {
        delete trait.sequence

        return trait
      })

    const serializedData = {
      subtraits,
      traits
    }

    Log('CpGeneralSettings.save serializedData', serializedData)
  }

  async _addPageItem ($html, $addListButton, payload) {
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
        }
      }
    )

    $list.insertAdjacentHTML('beforeend', listItemHtml)

    const $newListItem = $list
      .querySelector(`.${listTypePlural}-list-item[data-sort-sequence="${sequence}"]`)

    const $dragSortHandler = $newListItem
      .querySelector('.drag-sort-handle')

    addDragSort($dragSortHandler, this._onDragSortDrop)

    const pageHtml = await renderTemplate(
      `systems/cortexprime/system/templates/partials/${templatePath}`,
      templateData,
    )

    $html
      .querySelector(`.${listTypeSingular}-pages`)
      .insertAdjacentHTML('beforeend', pageHtml)
  }

  _onDragSortDrop ($dragSortList) {
    this._reapplySortSequence($dragSortList)
  }

  _reapplySortSequence ($dragSortList) {
    Array.from($dragSortList.children)
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index
        $item
          .querySelector('.drag-sort-item-sequence')
          .value = index
      })
  }

  _switchPage ($html, { currentId, targetId }) {
    $html
      .querySelector(currentId ? `.GeneralSettings-page[data-id="${currentId}"]` : '.list-page')
      .classList
      .add('hide')

    $html
      .querySelector(targetId ? `.GeneralSettings-page[data-id="${targetId}"]` : '.list-page')
      .classList
      .remove('hide')
  }
}

// "Are you sure?"" on closing, or reset and save; warning that any unsaved progress will be lost
// stress/trauma trait should have no dice'
// Add dice selector functionality
// TODO: Edit form for traits and subtraits
// // On changing min/max die rating should adjust the other to fit
// // Add subtraits allowed checkbox area to traits
// // // Upon resorting or deleting subtraits, adjust the allowed subtraits in traits areas
// TODO: [numbers?] Think about how to add number fields (life points, quantity, weight, distance, etc.)
// TODO: [booleans?] Think about how to add boolean/checkbox fields (shaken & stricken)
// TODO: [descriptors] Think about how to add key/value pair fields (limits)
// TODO: Growth Tracking
// TODO: (FUTURE) when deleting trait or subtrait other sheets will be properly updated
// TODO: (FUTURE) save trait settings; wait until editing is working properly
// Make Traits expanded in RollResult a setting for precollapsed or not (default not)