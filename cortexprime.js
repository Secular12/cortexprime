import CpActorCharacterModel from './system/models/CpActorCharacterModel.js'
import PlotPoint from './system/PlotPoint.js'

Hooks.once('init', () => {
  console.log(`Initializing Cortex Prime system...`)

  CONFIG.Actor.systemDataModels['character'] = CpActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint
})
