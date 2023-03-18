import hooks from './system/hooks/index.js'
import { registerHandlebarHelpers, } from './system/lib/handbarHelpers.js/index.js'
import Logger from './system/lib/Logger.js'
const Log = Logger()

Hooks.once('init', () => {
  CONFIG.debug.logs = true

  game.cortexprime = {}

  Log('Initializing Cortex prime system...')

  registerHandlebarHelpers()
  hooks()
})
