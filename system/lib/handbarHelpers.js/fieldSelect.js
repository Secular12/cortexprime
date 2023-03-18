export default (value, items, name, val, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass'
  ]

  return new Handlebars.SafeString(
    '<div class="field field-select' +
    (options.hash.disabled === true ? ' field-disabled' : '') +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? '<label' : '<div') +
    ` class="field-wrapper` +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">' +
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    `<select ` +
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
    items
      .map(item => {
        return `<option value="${item[val]}"` +
        (item[val] === value ? ' selected>' : '>') +
        `${item[name]}</option>`
      })
      .join('') +
    `</select>` +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
}