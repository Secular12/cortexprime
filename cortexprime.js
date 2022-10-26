import CpActorCharacterModel from './system/models/CpActorCharacterModel.js'
import { CpActor } from './system/Documents/CpActor.js'
import PlotPoint from './system/PlotPoint.js'
import { CpActorSheet } from './system/documents/CpActorSheet.js'
import Logger from './lib/Logger.js'

Hooks.once('init', () => {
  Logger('verbose')(`Initializing Cortex Prime system...`)

  CONFIG.Actor.documentClass = CpActor
  CONFIG.Actor.systemDataModels['character'] = CpActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint

  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('cortexprime', CpActorSheet, { makeDefault: true })
})
