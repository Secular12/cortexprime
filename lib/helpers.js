export const isArray = arr => {
  return arr && arr.constructor === Array
}

export const isObject = obj => {
  return obj && obj !== null && typeof obj === 'object' && !isArray(obj)
}

export const listLength = value => {
  if (isArray(value)) return value.length
  if (isObject(value)) return Object.keys(value).length

  return -1
}

export const resetDataObject = ({ path, source }, pathIndex = 0) => {
  if (source[path[pathIndex]]) {
    return {
      ...source,
      [path[pathIndex]]: Object.keys(source[path[pathIndex]])
        .reduce((acc, key, index) => {
          return {
            ...acc,
            [index]: resetDataObject({ path, source: source[path[pathIndex]][key] }, pathIndex + 1)
          }
        }, {})
    }
  }

  return source
}
