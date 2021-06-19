export const addNewDataPoint = async function (data, path, value) {
  const currentData = data || {}

  await this.actor.update({
    [`data.${path}`]: {
      ...currentData,
      [Object.keys(currentData).length]: value
    }
  })
}

export const resetDataPoint = async function (path, target, value) {
  await this.actor.update({
    [`${path}.-=${target}`]: null
  })

  await this.actor.update({
    [`${path}.${target}`]: value
  })
}

export const toggleItems = async function (html) {
  html.find('.toggle-item').click(async event => {
    event.preventDefault()
    const $target = $(event.currentTarget)
    const path = $target.data('path')
    const value = !getProperty(this.actor.data, path)

    await this.actor.update({
      [path]: value
    })
  })
}

export const removeDataPoint = async function (data, path, target, key) {
  const currentData = data || {}

  const newData = Object.keys(currentData)
    .reduce((acc, currentKey) => {
      if (+currentKey !== +key) {
        return { ...acc, [Object.keys(acc).length]: currentData[currentKey] }
      }

      return acc
    }, {})

  await resetDataPoint.call(this, path, target, newData)
}

export const removeItems = async function (html) {
  html.find('.remove-item').click(async event => {
    event.preventDefault()
    const {
      path,
      itemKey,
      target
    } = event.currentTarget.dataset

    const data = getProperty(this.actor.data, `${path}.${target}`)

    await removeDataPoint.call(this, data, path, target, itemKey)
  })
}
