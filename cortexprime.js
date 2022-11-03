import { CpActor } from './system/Documents/CpActor.js'
import CpActorCharacterModel from './system/models/CpActorCharacterModel.js'
import { CpItem } from './system/documents/CpItem.js'
import CpItemAssetModel from './system/models/CpItemAssetModel.js'
import { registerHandlebarHelpers } from './system/scripts/handlebarHelpers.js'
import Logger from './lib/Logger.js'
import PlotPoint from './system/documents/PlotPoint.js'
import { preloadHandlebarsTemplates } from './system/scripts/preloadTemplates.js'
import { registerSettings } from './system/settings.js'
import { registerSheets } from './system/scripts/registerSheets.js'

Hooks.once('init', () => {
  Logger('verbose')(`Initializing Cortex Prime system...`)

  CONFIG.Actor.documentClass = CpActor
  CONFIG.Actor.systemDataModels['character'] = CpActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint
  CONFIG.Item.documentClass = CpItem
  CONFIG.Item.systemDataModels['asset'] = CpItemAssetModel

  preloadHandlebarsTemplates()
  registerHandlebarHelpers()
  registerSettings()
  registerSheets()
})
