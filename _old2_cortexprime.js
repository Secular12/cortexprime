import { CpActor } from './system/Documents/CpActor.js'
import CpActorModel from './system/models/CpActorModel.js'
import { CpItem } from './system/documents/CpItem.js'
import CpItemModel from './system/models/CpItemModel.js'
import { registerHandlebarHelpers } from './system/scripts/handlebarHelpers.js'
import Logger from './lib/Logger.js'
import PlotPoint from './system/documents/PlotPoint.js'
import { preloadHandlebarsTemplates } from './system/scripts/preloadTemplates.js'
import { registerSettings } from './system/settings.js'
import { registerSheets } from './system/scripts/registerSheets.js'

Hooks.once('init', () => {
  CONFIG.debug.logs = 'debug'
  
  Logger('verbose')(`Initializing Cortex Prime system...`)

  CONFIG.Actor.documentClass = CpActor
  CONFIG.Actor.systemDataModels['actor'] = CpActorModel
  CONFIG.Dice.terms['p'] = PlotPoint
  CONFIG.Item.documentClass = CpItem
  CONFIG.Item.systemDataModels['item'] = CpItemModel

  preloadHandlebarsTemplates()
  registerHandlebarHelpers()
  registerSettings()
  registerSheets()
})
