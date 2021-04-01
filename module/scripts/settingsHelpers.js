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
