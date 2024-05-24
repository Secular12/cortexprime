export default method => (...args) => {
  if (CONFIG.debug?.logs) {
    if (!method || typeof method === 'string') console[method || 'log'](...args)
    else args.forEach((arg, index) => {
      console[method?.[index] ?? 'log'](arg)
    })
  }
}
