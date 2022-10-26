import CpActorCharacterModel from './system/models/CpActorCharacterModel.js'
import { CpActor } from './system/Documents/CpActor.js'
import PlotPoint from './system/PlotPoint.js'
import Logger from './lib/Logger.js'

Hooks.once('init', () => {
  CONFIG.debug.logs = 'info'

  Logger('log', 'info')(`Initializing Cortex Prime system...`)

  CONFIG.Actor.documentClass = CpActor
  CONFIG.Actor.systemDataModels['character'] = CpActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint
})
