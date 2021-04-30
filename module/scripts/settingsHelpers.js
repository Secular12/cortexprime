import { indexObjectValues, objectFilter, objectReduce } from '../../lib/helpers.js'

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

export const createNewField = ({ name, type = 'text', value: v }) => {
  const values = !Array.isArray(v)
    ? v !== null ? [v] : ['']
    : v

  return values.reduce((acc, value) => {
    if (type === 'textarea') {
      return `${acc}<textarea name="${name}">${value}</textarea>`
    }

    if (type === 'checkbox') {
      const checked = value ? ' checked' : ''
      return `${acc}<input type="checkbox" name="${name}"${checked} />`
    }

    return `${acc}<input type="${type}" name="${name}" value="${value}" />`
  }, '')
}

export const createNewFieldElements = (items = []) => {
  const fieldContainer = document.createElement('div')

  fieldContainer.innerHTML = items.map(item => createNewField(item)).join('')

  return fieldContainer
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

export const removeItem = function (html) {
  html.find('.remove-item').click(async event => {
    event.preventDefault()
    const {
      group,
      itemKey,
      itemName,
      setting
    } = event.currentTarget.dataset
    if (confirm(`Are you sure you want to remove ${itemName}`)) {
      if (setting) {
        const currentBreadcrumbs = game.settings.get('cortexprime', 'actorBreadcrumbs')
        const currentSettings = game.settings.get('cortexprime', setting)
        const currentGroupSettings = group ? await getProperty(currentSettings, group) : currentSettings
        const settingValue = indexObjectValues(objectFilter(currentGroupSettings, (_, key) => key !== itemKey))
        const breadcrumbsValue = objectReduce(currentBreadcrumbs, (acc, value, key, length) => {
          if (+key === length - 1) return acc
          return {
            ...acc,
            [key]: {
              ...value,
              active: +key === (length - 2)
            }
          }
        })

        await game.settings.set('cortexprime', setting, settingValue)
        await game.settings.set('cortexprime', 'actorBreadcrumbs', breadcrumbsValue)
        this.render(true)
      }
    }
  })
}

export const removeParentElements = function (html) {
  html.find('.remove-parent-element').click(async event => {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const selector = $target.data('selector')

    html.find('.reset-field').val('true')

    $target
      .closest(selector)
      .remove()

    await this._onSubmit(event)
    this.render(true)
  })
}

export const addFormElements = async function (event, fieldsArrayCb) {
  event.preventDefault()
  const $form = this.form

  const htmlString = createNewFieldElements(fieldsArrayCb(event.currentTarget.dataset))

  $form.append(htmlString)
  await this._onSubmit(event)
  this.render(true)
}
