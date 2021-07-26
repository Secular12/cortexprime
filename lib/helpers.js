const getFirstMatch = (obj, cb, matchAll = false, keys = null, keyIndex = null) => {
  const objKeys = Object.keys(obj)

  if (!keys) {
    return getFirstMatch(obj, cb, matchAll, objKeys, 0)
  }

  if (keyIndex === keys.length) return { found: matchAll, key: undefined, value: undefined }

  const key = keys[keyIndex]

  const truthyCb = !!cb(obj[key], key, objKeys.length)

  if ((truthyCb && !matchAll) || (!truthyCb && matchAll)) return { found: !matchAll, key, value: obj[key] }

  return getFirstMatch(obj, cb, matchAll, keys, keyIndex + 1)
}

export const getLength = value => {
  if (isArray(value ?? [])) return value.length
  if (isObject(value)) return Object.keys(value).length

  return -1
}

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

export const objectEvery = (obj, cb) => {
  return getFirstMatch(obj, cb, true).found
}

export const objectFilter = (obj, cb) => {
  const objKeys = Object.keys(obj)

  return objKeys
    .reduce((acc, key) => {
      return cb(obj[key], key, objKeys.length)
        ? { ...acc, [key]: obj[key] }
        : acc
    }, {})
}

export const objectFindEntry = (obj, cb) => {
  const { key, value } = getFirstMatch(obj, cb)

  return { key, value }
}

export const objectFindKey = (obj, cb) => {
  return getFirstMatch(obj, cb).key
}

export const objectFindValue = (obj, cb) => {
  return getFirstMatch(obj, cb).value
}

export const objectForEach = (obj, cb) => {
  const objKeys = Object.keys(obj)
  objKeys
    .forEach(key => {
      cb(obj[key], key, objKeys.length)
    })
}

export const objectIncludes = (obj, value) => {
  return Object.values(obj).includes(value)
}

export const objectIncludesKey = (obj, value) => {
  return Object.keys(obj).includes(value)
}

export const objectMapKeys = (obj, cb) => {
  const objKeys = Object.keys(obj)
  return objKeys
    .reduce((acc, key) => {
      return { ...acc, [cb(obj[key], key, objKeys.length)]: obj[key] }
    }, {})
}

export const objectMap = (obj, cb) => {
  const objKeys = Object.keys(obj)
  return objKeys
    .reduce((acc, key) => {
      return { ...acc, ...cb(obj[key], key, objKeys.length) }
    }, {})
}

export const objectMapValues = (obj, cb) => {
  const objKeys = Object.keys(obj)
  return objKeys
    .reduce((acc, key) => {
      return { ...acc, [key]: cb(obj[key], key, objKeys.length) }
    }, {})
}

export const objectReduce = (obj, cb, start) => {
  const objKeys = Object.keys(obj)
  return objKeys
    .reduce((acc, key) => {
      return cb(acc, obj[key], key, objKeys.length)
    }, start)
}

export const objectReindexFilter = (obj, cb) => {
  const objKeys = Object.keys(obj)

  return objKeys
    .reduce((acc, key) => {
      return cb(obj[key], key, objKeys.length)
        ? { ...acc, [getLength(acc)]: obj[key] }
        : acc
    }, {})
}

export const objectSome = (obj, cb) => {
  return getFirstMatch(obj, cb).found
}

export const objectSort = (obj, cb) => {
  const keys = Object.keys(obj)

  const callback = cb
    ? cb
    : (a, b) => b > a ? -1 : a > b ? 1 : 0

  keys.sort((a, b) => callback(obj[a], obj[b], a, b, keys.length))

  return keys
    .reduce((acc, key) => {
      return { ...acc, [key]: obj[key] }
    }, {})
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
