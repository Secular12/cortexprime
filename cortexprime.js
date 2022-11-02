import { CpActor } from './system/Documents/CpActor.js'
import CpActorCharacterModel from './system/models/CpActorCharacterModel.js'
import { CpActorCharacterSheet } from './system/documents/CpActorCharacterSheet.js'
import { registerHandlebarHelpers } from './system/scripts/handlebarHelpers.js'
import Logger from './lib/Logger.js'
import PlotPoint from './system/documents/PlotPoint.js'
import { preloadHandlebarsTemplates } from './system/scripts/preloadTemplates.js'
import { registerSettings } from './system/settings.js'

Hooks.once('init', () => {
  Logger('verbose')(`Initializing Cortex Prime system...`)

  CONFIG.Actor.documentClass = CpActor
  CONFIG.Actor.systemDataModels['character'] = CpActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint

  preloadHandlebarsTemplates()
  registerHandlebarHelpers()
  registerSettings()

  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('cortexprime', CpActorCharacterSheet, { makeDefault: true })
})
