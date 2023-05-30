export default (value, items, name, val, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'noEdit',
    'wrapperClass'
  ]

  const getOptions = (items, value, name, val) => {
    return items
      .map(item => {
        return item.label 
          ? item.options?.length > 0
            ? `<optgroup label="${item.label}">` +
              getOptions(item.options, value, name, val) +
              `</optgroup>`
            : null
          : `<option value="${item[val]}"` +
            (item[val] === value ? ' selected>' : '>') +
            `${item[name]}</option>`
      })
      .filter(itemString => itemString)
      .join('')
  }

  const getViewValue = (value) => {
    const matchingValue = items.find(item => item[val] === value)

    return matchingValue?.[name]
  }

  return new Handlebars.SafeString(
    '<div class="field field-select' +
    (options.hash.noEdit ? ' field-view' : '') +
    (options.hash.disabled === true ? ' field-disabled' : '') +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label && !options.hash.noEdit ? '<label' : '<div') +
    ` class="field-wrapper` +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">' +
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    (
      options.hash.noEdit
        ? `<p class="field-view-value">${getViewValue(value)}</p>`
        : `<select ` +
          Object.entries(options.hash)
            .reduce((attributes, [key, value]) => {
              if (inputHashIgnore.includes(key)) return attributes
      
              if (['disabled', 'required'].includes(key) && value === true) {
                return [...attributes, key]
              }
      
              if (key === 'inputClass') {
                attributes[0] = `class="field-input ${value}"`
                return attributes
              }
      
              const val = value ?? null
      
              return [...attributes, val || val === 0 ? `${key}="${value}"` : '']
            }, ['class="field-input"'])
            .join(' ') +
          `>` +
          getOptions(items, value, name, val) +
          `</select>` 
    ) +
    (options.hash.label && !options.hash.noEdit ? `</label>` : '</div>') +
    (options.hash.hint && !options.hash.noEdit ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
}