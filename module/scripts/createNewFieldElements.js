const createNewField = ({ name, type = 'text', value: v }) => {
  const values = !Array.isArray(v)
    ? v !== null ? [v] : ['']
    : v

  console.log(v, values)

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

export default (items = []) => {
  const fieldContainer = document.createElement('div')

  fieldContainer.innerHTML = items.map(item => createNewField(item)).join('')

  return fieldContainer
}