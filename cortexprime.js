import PlotPoint from './system/PlotPoint.js'

Hooks.once('init', () => {
  console.log(`Initializing Cortex Prime system...`)

  CONFIG.Dice.terms['p'] = PlotPoint
})
