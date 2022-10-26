const debugLevels = [
  { name: 'none', value: 0 },
  { name: 'info', value: 10 },
  { name: 'warn', value: 20 },
  { name: 'debug', value: 30 },
  { name: 'verbose', value: 40 },
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
  const currentDebugLevel = getDebugLevel()(CONFIG.debug.logs)
  const debugLevelNumber = getDebugLevel(typeof debugLevel === 'string' ? 'name' : 'value')(debugLevel)

  return debugLevelNumber.value <= currentDebugLevel.value
}

export default (method, debugLevel = 'none') => (...args) => {
  if (checkDebugLevel(debugLevel)) return console[method](...args)
}