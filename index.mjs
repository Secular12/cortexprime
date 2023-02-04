import Logger from './system/lib/Logger.js'

Hooks.once('init', () => {
  CONFIG.debug.logs = true

  game.cortexprime = {}

  Logger()('Initializing Cortex prime system...')
})
