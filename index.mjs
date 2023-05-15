import hooks from './system/hooks/index.js'
import { registerHandlebarHelpers, } from './system/lib/handbarHelpers.js/index.js'
import Logger from './system/lib/Logger.js'
import sockets from './system/lib/sockets.js'
import { registerSettings } from './system/settings.js'

const Log = Logger()

Hooks.once('init', () => {

  game.socket.on('system.cortexprime', sockets)

  CONFIG.debug.logs = true
  
  Log('Initializing Cortex prime system...')
  
  game.cortexprime = {}

  registerHandlebarHelpers()
  registerSettings()
  hooks()
})
