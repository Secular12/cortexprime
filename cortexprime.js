import { CortexPrimeActor } from './module/entities/CortexPrimeActor.js'
import PlotPoint from './module/PlotPoint.js'
import { preloadHandlebarsTemplates } from './module/handlebars/preloadTemplates.js'
import { registerHandlebarHelpers } from './module/handlebars/helpers.js'
import { registerSettings } from './module/settings/settings.js'
import { CortexPrimeActorSheet } from './module/actor/actor-sheet.js'
import cortexPrimeHooks from './module/cortexPrimeHooks.js'

Hooks.once('init', () => {
  console.log(`CP | Initializing Cortex Prime`)

  game.cortexprime = {
    CortexPrimeActor
  }

  CONFIG.Actor.documentClass = CortexPrimeActor
  CONFIG.Dice.terms['p'] = PlotPoint

  registerHandlebarHelpers()
  preloadHandlebarsTemplates()
  registerSettings()

  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet)
  foundry.documents.collections.Actors.registerSheet("cortexprime", CortexPrimeActorSheet, { makeDefault: true })

  cortexPrimeHooks()
})