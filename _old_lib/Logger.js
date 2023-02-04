const debugLevels = [
  { name: 'none', value: 0 },
  { name: 'warn', value: 10 },
  { name: 'debug', value: 20 },
  { name: 'verbose', value: 30 },
]

const getDebugLevel = (by = 'name') => (targetLevel) => {
  return debugLevels
    .find(level => {
      return by === 'value'
          ? level.value === targetLevel
          : level.name === ((targetLevel ?? 'none')?.toLowerCase())
    }) ?? debugLevels[0]
}

const checkDebugLevel = (debugLevel) => {
  const currentDebugLevel = getDebugLevel()(CONFIG.debug?.logs)
  const debugLevelNumber = getDebugLevel(typeof debugLevel === 'string' ? 'name' : 'value')(debugLevel)

  return debugLevelNumber.value <= currentDebugLevel.value
}

export default (debugLevel, method) => (...args) => {
  if (checkDebugLevel(debugLevel)) {
    if (!method || typeof method === 'string') console[method || 'log'](...args)
    else args.forEach((arg, index) => {
      console[method?.[index] ?? 'log'](arg)
    })
  }
}
