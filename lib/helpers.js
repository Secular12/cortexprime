export const indexObjectValues = obj => {
  return Object.keys(obj)
    .reduce((acc, key, index) => {
      return { ...acc, [index]: obj[key] }
    }, {})
}

export const isArray = arr => {
  return arr && arr.constructor === Array
}

export const isObject = obj => {
  return obj && obj !== null && typeof obj === 'object' && !isArray(obj)
}

export const objectFilter = (obj, cb) => {
  const objectKeys = Object.keys(obj)
  return Object.keys(obj)
    .reduce((acc, key) => {
      const keep = cb(obj[key], key, objectKeys.length)
      return keep ? { ...acc, [key]: obj[key] } : acc
    }, {})
}

export const objectFindKey = (obj, cb, currentKeyIndex = 0) => {
  const objectKeys = Object.keys(obj)

  if (currentKeyIndex > objectKeys.length) return acc.value

  const currentKey = objectKeys[currentKeyIndex]

  if (cb(obj[currentKey], currentKey)) return currentKey

  return objectFindKey(obj, cb, currentKeyIndex + 1)
}

export const objectFindValue = (obj, cb, currentKeyIndex = 0) => {
  const objectKeys = Object.keys(obj)

  if (currentKeyIndex > objectKeys.length) return acc.value

  const currentKey = objectKeys[currentKeyIndex]

  if (cb(obj[currentKey], currentKey)) return obj[currentKey]

  return objectFindValue(obj, cb, currentKeyIndex + 1)
}

export const objectMapKeys = (obj, cb) => {
  const objectKeys = Object.keys(obj)
  return objectKeys
    .reduce((acc, key) => {
      return {
        ...acc,
        [cb(obj[key], key, objectKeys.length)]: obj[key]
      }
    }, {})
}

export const objectMap = (obj, cb) => {
  const objectKeys = Object.keys(obj)
  return objectKeys
    .reduce((acc, key) => {
      return {
        ...acc,
        ...cb(obj[key], key, objectKeys.length)
      }
    }, {})
}

export const objectMapValues = (obj, cb) => {
  const objectKeys = Object.keys(obj)
  return objectKeys
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: cb(obj[key], key, objectKeys.length)
      }
    }, {})
}

export const objectReduce = (obj, cb, start) => {
  const objectKeys = Object.keys(obj)
  return objectKeys
    .reduce((acc, key) => {
      return cb(acc, obj[key], key, objectKeys.length)
    }, start)
}

export const objectSortByKeys = (obj, cb) => {
  return [...Object.keys(obj)]
    .sort((a, b) => cb(a, b))
    .reduce((acc, key) => {
      return {...acc, [key]: obj[key]}
    }, {})
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
