import ActorCharacterModel from './system/models/ActorCharacterModel.js'
import PlotPoint from './system/PlotPoint.js'

Hooks.once('init', () => {
  console.log(`Initializing Cortex Prime system...`)

  CONFIG.Actor.systemDataModels['character'] = ActorCharacterModel
  CONFIG.Dice.terms['p'] = PlotPoint
})
