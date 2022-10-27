import { CpActor } from './system/Documents/CpActor.js'
import CpActorCharacterModel from './system/models/CpActorCharacterModel.js'
import { CpActorSheet } from './system/documents/CpActorSheet.js'
import { registerHandlebarHelpers } from './system/scripts/handlebarHelpers.js'
import Logger from './lib/Logger.js'
import PlotPoint from './system/PlotPoint.js'
import { preloadHandlebarsTemplates } from './system/scripts/preloadTemplates.js'

Hooks.once('init', () => {
  Logger('verbose')(`Initializing Cortex Prime system...`)

  CONFIG.Actor.documentClass = CpActor
  CONFIG.Actor.systemDataModels['character'] = CpActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint

  preloadHandlebarsTemplates()
  registerHandlebarHelpers()

  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('cortexprime', CpActorSheet, { makeDefault: true })
})
