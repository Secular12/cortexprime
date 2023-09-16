import { diceSelectListener } from '../lib/formHelpers.js'

import {
  addDragSort,
  dragSort
} from '../lib/dragSort.js'

import {
  addListeners,
  displayToggle,
  localizer,
  objectSortToArray,
  uuid,
  checkboxDisplayToggle
} from '../lib/helpers.js'

import Logger from '../lib/Logger.js'
import { getDieIcon } from '../lib/dice.js'

const Log = Logger()

export default class CpItemSettings extends FormApplication {
  constructor() {
    super()

    const traitSettings = game.settings.get('cortexprime', 'itemTypes')

    this.traitSettings = traitSettings

    Log('CpItemSettings.constructor traitSettings', traitSettings)
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ItemSettings',
      left: 400,
      resizable: false,
      scrollY: ['#ItemSettings-form-body'],
      submitOnChange: false,
      submitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpItemSettings.html',
      title: localizer('CP.ItemSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const data = this.traitSettings

    Log('CPItemSettings.getData data:', data)

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = expandObject(formData)

    Log('CPItemSettings._updateSettings expandedData:', expandedData)
    
    await this.save(event.target, expandedData)
  }

  activateListeners(html) {
    super.activateListeners(html)
    const [$html] = html

    dragSort($html, this._onDragSortDrop.bind(this, $html))

    diceSelectListener(
      $html,
      {
        changeDie: this.onChangeDie.bind(this),
      }
    )

    checkboxDisplayToggle($html)

    displayToggle($html)

    addListeners(
      $html,
      '#ItemSettings-main',
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
      '#ItemSettings-pages-container',
      'change',
      (event) => {
        const $rollsSeparatelyField = event.target.closest('.input-rolls-separately')

        if ($rollsSeparatelyField) {
          this.onChangeRollsSeparately(event, $rollsSeparatelyField)
          return
        }
      }
    )

    addListeners(
      $html,
      '#ItemSettings-pages-container',
      'click',
      (event) => {
        const $addDescriptor = event.target.closest('.add-descriptor')

        if ($addDescriptor) {
          this.addDescriptor($html, event, $addDescriptor)
          return
        }

        const $deleteDescriptor = event.target.closest('.delete-descriptor')

        if ($deleteDescriptor) {
          this.deleteDescriptor($deleteDescriptor)
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
          this.deleteSubtrait($html, $deleteSubtrait)
          return
        }
      }
    )

    addListeners(
      $html,
      '.subtrait-pages',
      'change',
      (event) => {
        const $subtraitName = event
          .target
          .closest('.ItemSettings-subtrait-field-name-input')

        if ($subtraitName) {
          this.updateSubtraitName($html, $subtraitName)
          return
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
          return
        }
      }
    )

    addListeners(
      $html,
      '.trait-pages',
      'change',
      (event) => {
        const $traitName = event
          .target
          .closest('.ItemSettings-trait-field-name-input')

        if ($traitName) {
          this.updateTraitName($html, $traitName)
          return
        }
      }
    )

    $html
      .querySelector('.settings-reset')
      .addEventListener('click', this.reset.bind(this))
  }

  async addDescriptor ($html, event, $addDescriptor) {
    const descriptor = { label: 'New Descriptor' }
    const { path } = $addDescriptor.dataset
    const sequence = $addDescriptor
      .closest('.item-list')
      .querySelectorAll('.descriptors-list-item')
      .length

    const content = await renderTemplate(
      'systems/cortexprime/system/templates/partials/ItemSettings/Descriptor.html',
      {
        descriptor,
        path,
        sequence,
      }
    )

    const $list = $addDescriptor
      .closest('.item-list')
      .querySelector('.descriptors-list')

    $list
      .insertAdjacentHTML('beforeend', content)

    const $dragSortHandler = $list
      .querySelector(`.descriptors-list-item[data-sort-sequence="${sequence}"] .drag-sort-handle`)

    addDragSort($dragSortHandler, () => this._onDragSortDrop($html, $list))
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
        templatePath: 'ItemSettings/SubtraitPage.html',
        templateData: {
          subtrait: {
            id,
            allowMultipleDice: false,
            allowNoDice: false,
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

    await this._appendSubtraitType($html, {
      subtraitId: id,
      label: 'New Subtrait'
    })
  }

  async addTrait ($html, $addTrait) {
    const id = uuid()

    const subtraits = Array.from(
      $html.querySelectorAll('.subtraits-list-item')
    )
      .map($subTrait => ({
        id: $subTrait.dataset.id,
        name: $subTrait.dataset.name,
      }))

    await this._addPageItem(
      $html,
      $addTrait,
      {
        id,
        itemName: 'New Trait',
        itemsPath: 'traits',
        listTypePlural: 'traits',
        listTypeSingular: 'trait',
        templatePath: 'ItemSettings/TraitPage.html',
        templateData: {
          subtraits,
          trait: {
            id,
            allowMultipleDice: false,
            allowNoDice: false,
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

  async close () {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.CloseConfirmTitle'),
      content: localizer('CP.CloseConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
      return super.close()
    }
  }

  async deleteDescriptor ($deleteDescriptor) {
    const $descriptorsList = $deleteDescriptor
      .closest('.descriptors-list')

    $deleteDescriptor
      .closest('.descriptors-list-item')
      .remove()

    $descriptorsList
      .querySelectorAll('.descriptors-list-item')
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index
      })
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

      $html
        .querySelector(`.ItemSettings-page[data-id="${id}"]`)
        .remove()

      this._reapplySortSequence($html, $dragSortList)
    }

    return confirmed
  }

  async deleteSubtrait ($html, $deleteSubtrait) {
    const { id } = $deleteSubtrait
      .closest('.subtraits-list-item')
      .dataset

    const deleted = await this.deletePageItem($html, $deleteSubtrait, '.subtraits-list-item')

    if (deleted) {
      $html
        .querySelectorAll(`.ItemSettings-subtrait-types [data-subtrait-id="${id}"]`)
        .forEach($subtraitTypeCheckbox => {
          $subtraitTypeCheckbox
            .closest('.ItemSettings-trait-field-subtrait-types')
            .remove()
        })
    }
  }

  async duplicateSubtrait ($html, $duplicateSubtrait) {
    const id = uuid()
    
    const { id: currentId } = $duplicateSubtrait
      .closest('.subtraits-list-item')
      .dataset

    const $currentSubtraitPage = $html
      .querySelector(`.ItemSettings-page[data-id="${currentId}"]`)

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
        templatePath: 'ItemSettings/SubtraitPage.html',
        templateData: {
          subtrait: {
            id,
            allowMultipleDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.allowMultipleDice"]`)
              ?.checked ?? false,
            allowNoDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.allowNoDice"]`)
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

    await this._appendSubtraitType($html, {
      label: name,
      subtraitId: id,
    })

    this._switchPage($html, { targetId: id })
  }

  async duplicateTrait ($html, $duplicateTrait) {
    const id = uuid()
    
    const { id: currentId } = $duplicateTrait
      .closest('.traits-list-item')
      .dataset

    const $currentTraitPage = $html
      .querySelector(`.ItemSettings-page[data-id="${currentId}"]`)

    const name = (
      $currentTraitPage
        ?.querySelector(`[name="traits.${currentId}.name"]`)
        ?.value ?? 'New Trait'
    ) + ' (duplicate)'

    const subtraits = Array.from(
      $html.querySelectorAll('.subtraits-list-item')
    )
      .map($subTrait => ({
        id: $subTrait.dataset.id,
        name: $subTrait.dataset.name,
      }))

    await this._addPageItem(
      $html,
      $duplicateTrait,
      {
        id,
        itemName: name,
        itemsPath: 'traits',
        listTypePlural: 'traits',
        listTypeSingular: 'trait',
        templatePath: 'ItemSettings/TraitPage.html',
        templateData: {
          subtraits,
          trait: {
            id,
            allowMultipleDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.allowMultipleDice"]`)
              ?.checked ?? false,
            allowNoDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.allowNoDice"]`)
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
            subtraitTypes: Array.from(
              $currentTraitPage
                ?.querySelectorAll(`[name="traits.${currentId}.subtraitTypes"]:checked`)
            )
              .map($subtraitType => $subtraitType.value)
          }
        },
      }
    )

    this._switchPage($html, { targetId: id })
  }

  async goToPage (event, $html, $goToPage) {
    const {
      currentId,
      targetId
    } = $goToPage?.dataset ?? event.currentTarget.dataset

    this._switchPage($html, { currentId, targetId })
  }

  async onChangeDie (event, { index, value }) {
    const $diceSelect = event.target.closest('.dice-select')
    const $dieWrapper = event.target.closest('.die-wrapper')
    const $dieSelect = $dieWrapper.querySelector('.die-select')

    $diceSelect
      .querySelector('.cp-die')
      .outerHTML = getDieIcon(value)

    $dieSelect.value = value

    const $listItemPage = $diceSelect.closest('.list-item-page')
    const $maxDieRating = $listItemPage.querySelector('.max-die-rating')
    const $minDieRating = $listItemPage.querySelector('.min-die-rating')

    if (
      $diceSelect.classList.contains('min-die-rating') &&
      parseInt(value, 10) > parseInt($maxDieRating.querySelector('.die-select').value, 10) 
    ) {
      $maxDieRating.value = value

      $maxDieRating
        .querySelector('.cp-die')
        .outerHTML = getDieIcon(value)

      $maxDieRating
        .querySelector('.die-select')
        .value = value
    } else if (
      $diceSelect.classList.contains('max-die-rating') &&
      parseInt(value, 10) < parseInt($minDieRating.querySelector('.die-select').value, 10) 
    ) {
      $minDieRating.value = value

      $minDieRating
        .querySelector('.cp-die')
        .outerHTML = getDieIcon(value)

      $minDieRating
        .querySelector('.die-select')
        .value = value
    }
  }

  async onChangeRollsSeparately(event, $rollsSeparatelyField) {
    const isChecked = $rollsSeparatelyField.checked

    const $hasHitchesField = $rollsSeparatelyField
      .closest('.ItemSettings-page')
      .querySelector('.input-has-hitches')

    $hasHitchesField.checked = !isChecked
    $hasHitchesField.disabled = !isChecked

    $hasHitchesField
      .closest('.field')
      .classList
      .toggle('field-disabled', !isChecked)
  }

  async reset () {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.ResetConfirmTitle'),
      content: localizer('CP.ResetConfirmContent'),
      defaultYes: false,
    })

    if (confirmed) {
      this.render(true)
    }
  }

  async save ($html, expandedData) {
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
  
      const subtraits = objectSortToArray(expandedData.subtraits, sequenceSort)
        .map(subtrait => {
          delete subtrait.sequence

          subtrait.descriptors = Array.from(
            $html
              .querySelectorAll(`.subtrait-page[data-id="${subtrait.id}"] .descriptors-list-item`)
          )
            .map($listItem => {
              return {
                label: $listItem
                  .querySelector('.ItemSettings-descriptor-field-name-input')
                  .value
              }
            })
  
          return subtrait
        })
  
      const traits = objectSortToArray(expandedData.traits, sequenceSort)
        .map(trait => {
          delete trait.sequence

          trait.descriptors = Array.from(
            $html
              .querySelectorAll(`.trait-page[data-id="${trait.id}"] .descriptors-list-item`)
          )
            .map($listItem => {
              return {
                label: $listItem
                  .querySelector('.ItemSettings-descriptor-field-name-input')
                  .value
              }
            })
  
          trait.subtraitTypes = trait.subtraitTypes.filter(x => x)
  
          return trait
        })
  
      const serializedData = {
        subtraits,
        traits
      }
  
      Log('CpItemSettings.save serializedData', serializedData)

      // game.settings.set('cortexprime', 'itemTypes', serializedData)

      Dialog.prompt({
        title: localizer('CP.PromptSettingsSaveTitle'),
        content: localizer('CP.PromptSettingsSaveContent'),
      })
    }
  }

  updateSubtraitName ($html, $subtraitName) {
    const $subtraitPage = $subtraitName.closest('.subtrait-page')

    const { id } = $subtraitPage.dataset

    const subtraitName = $subtraitName.value

    $subtraitPage
      .querySelector('.subtrait-page-name')
      .textContent = subtraitName
    
    $html
      .querySelector(`.subtraits-list-item[data-id="${id}"] .subtraits-list-item-name`)
      .textContent = subtraitName

    $html
      .querySelectorAll(`.ItemSettings-trait-field-subtrait-types [data-subtrait-id="${id}"]`)
      .forEach($subtraitType => {
        $subtraitType
          .closest('.field-wrapper')
          .querySelector('.field-label')
          .textContent = subtraitName
      })
  }

  updateTraitName ($html, $traitName) {
    const $traitPage = $traitName.closest('.trait-page')

    const { id } = $traitPage.dataset

    const traitName = $traitName.value

    $traitPage
      .querySelector('.trait-page-name')
      .textContent = traitName
    
    $html
      .querySelector(`.traits-list-item[data-id="${id}"] .traits-list-item-name`)
      .textContent = traitName
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

    addDragSort($dragSortHandler, () => this._onDragSortDrop($html, $list))

    const pageHtml = await renderTemplate(
      `systems/cortexprime/system/templates/partials/${templatePath}`,
      templateData,
    )

    $html
      .querySelector(`.${listTypeSingular}-pages`)
      .insertAdjacentHTML('beforeend', pageHtml)

    this._switchPage($html, { targetId: id })
  }

  async _appendSubtraitType ($html, data) {
    const $traitPages = $html
      .querySelectorAll('.trait-page')

    await Promise.all(
      Array.from($traitPages)
        .map(async ($traitPage) => {
          const { id: traitId } = $traitPage.dataset
          
          const subtraitTypeHtml = await renderTemplate(
            'systems/cortexprime/system/templates/partials/ItemSettings/SubtraitType.html',
            {
              checked: false,
              subtraitId: data.subtraitId,
              trait: traitId,
              label: data.label,
            }
          )

          $traitPage
            .querySelector('.ItemSettings-subtrait-types')
            .insertAdjacentHTML('beforeend', subtraitTypeHtml)
        })
    )
  }

  _onDragSortDrop ($html, $dragSortList) {
    this._reapplySortSequence($html, $dragSortList)
  }

  _reapplySortSequence ($html, $dragSortList) {
    const { sortList } = $dragSortList.dataset

    Array.from($dragSortList.children)
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index
        const $dragSortItemSequence = $item
          .querySelector('.drag-sort-item-sequence')

        if ($dragSortItemSequence) {
          $dragSortItemSequence.value = index
        }

        if (sortList === 'subtraits') {
          $html
            .querySelectorAll('.ItemSettings-subtrait-types')
            .forEach($subtraitSection => {
              const $subtraitType = $subtraitSection
                .querySelector(`[data-subtrait-id="${$item.dataset.id}"]`)
                .closest('.ItemSettings-trait-field-subtrait-types')

                $subtraitSection.append($subtraitType)
            })
        }
      })
  }

  _switchPage ($html, { currentId, targetId }) {
    $html
      .querySelector(currentId ? `.ItemSettings-page[data-id="${currentId}"]` : '.list-page')
      .classList
      .add('hide')

    $html
      .querySelector(targetId ? `.ItemSettings-page[data-id="${targetId}"]` : '.list-page')
      .classList
      .remove('hide')
  }
}

/** Theme Settings ***/
// feat(0.3.0): Add temporary die
// feat(0.3.0): Add a heading 3 and apply to "Preset Descriptors" in Item Settings

/*** Dice Pool ***/
// feat(1.0.0): preview button in DicePool to preview pool prior to rolling
// // Use sockets to update and have a dropdown to choose which dice pool to view

/*** Item Settings ***/
// feat: [booleans or just tags?] Think about how to add boolean/checkbox fields (shaken & stricken)
// feat(0.3.0): save trait settings; wait until editing is working properly
// tweak(0.3.0): (FUTURE) when deleting trait or subtrait other sheets will be properly updated

/*** Item Sheets ***/
// feat(0.3.0): Create sheets
// feat(0.3.0): Drag & Drop subtrait items onto item sheets

/*** Actor Settings ***/
// feat(0.3.0): Create settings page
// feat(0.3.0): Layout options
// feat(1.0.0): Growth Tracking

/*** Actor Sheets ***/
// feat(0.3.0): Create sheets
// feat: temporary dice ratings
// feat(0.3.0): Drag and Drop trait and subtrait items onto sheets

/*** Misc Settings ***/
// feat(0.3.0): expandable roll result traits setting (default not)

/*** Misc ***/
// feat(0.3.0): textarea icon interpolation
// feat: Turn Order
// feat(1.0.0): Quick access sheet
// feat(0.3.0): Help Document/page