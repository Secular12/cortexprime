import { getLength, objectMapKeys, objectReduce, objectReindexFilter } from '../../lib/helpers.js'
import { localizer } from './foundryHelpers.js'

export const collapseToggle = function (html) {
  html.find('.collapse-toggle').click(async (event) => {
    event.preventDefault()
    const $element = $(event.currentTarget)
    const $collapseValue = $element
      .next('.collapse-value')

    $collapseValue.prop('checked', !($collapseValue.is(':checked')))

    await this._onSubmit(event)
    this.render(true)
  })
}

export const displayToggle = html => {
  html.find('input.display-toggle').change((event) => {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const scope = $target.data('scope')
    const selector = $target.data('selector')

    if (scope) {
      $(event.currentTarget)
        .closest(scope)
        .find(selector)
        .toggle()
    } else {
      html.find(selector).toggle()
    }
  })
}

export const removeItem = async function (html) {
  html.find('.remove-item').click(async event => {
    event.preventDefault()
    const {
      group,
      itemKey,
      itemName,
      setting,
      stayOnPage
    } = event.currentTarget.dataset

    let confirmed

    await Dialog.confirm({
      title: localizer('AreYouSure'),
      content: `${localizer('Remove')} ${itemName}?`,
      yes: () => { confirmed = true },
      no: () => { confirmed = false },
      defaultYes: false
    })

    if (confirmed) {
      if (setting) {
        let settings = game.settings.get('cortexprime', setting)

        const currentGroupSettings = group ? await getProperty(settings, group) : settings
        const groupSettingValue = objectReindexFilter(currentGroupSettings, (_, key) => +key !== +itemKey)

        if (group) {
          setProperty(settings, group, groupSettingValue)
        } else {
          settings = groupSettingValue
        }
        await game.settings.set('cortexprime', setting, settings)

        if (setting === 'actorTypes' && !stayOnPage) {
          const currentBreadcrumbs = game.settings.get('cortexprime', 'actorBreadcrumbs')

          const breadcrumbsValue = objectReduce(currentBreadcrumbs, (acc, value, key, length) => {
            if (+key === length - 1) return acc
            return {
              ...acc,
              [key]: {
                ...value,
                active: +key === (length - 2)
              }
            }
          }, {})

          await game.settings.set('cortexprime', 'actorBreadcrumbs', breadcrumbsValue)
        }

        this.render(true)
      }
    }
  })
}

export const reorderItem = async function (html) {
  html.find('.reorder').click(async event => {
    event.preventDefault()
    const {
      currentIndex,
      newIndex,
      path,
      setting
    } = event.currentTarget.dataset

    const settings = game.settings.get('cortexprime', setting)
    const targetObject = getProperty(settings, path) ?? {}
    const maxKey = getLength(targetObject ?? {}) - 1

    const key = +newIndex < 0
      ? maxKey
      : maxKey < +newIndex
        ? 0
        : +newIndex

    const value = objectMapKeys(targetObject, (_, targetKey) => {
      return +targetKey === +currentIndex
        ? key
        : +currentIndex > key
          ? +targetKey < +currentIndex && +targetKey >= key
            ? +targetKey + 1
            : +targetKey
          : +targetKey > +currentIndex && +targetKey <= key
            ? +targetKey - 1
            : +targetKey
    })

    setProperty(settings, path, value)

    await game.settings.set('cortexprime', setting, settings)
    this.render(true)
  })
}
