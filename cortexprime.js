import { CortexPrimeActor } from './module/entities/CortexPrimeActor.js'
import { CortexPrimeItem } from './module/entities/CortexPrimeItem.js'
import PlotPoint from './module/PlotPoint.js'
import { preloadHandlebarsTemplates } from './module/handlebars/preloadTemplates.js'
import { registerHandlebarHelpers } from './module/handlebars/helpers.js'
import { registerSettings } from './module/settings/settings.js'
import { CortexPrimeActorSheet } from "./module/actor/actor-sheet.js"
import cortexPrimeHooks from './module/cortexPrimeHooks.js'
import { CortexPrimeItemSheet } from './module/item/item-sheet.js'

Hooks.once('init', () => {
  console.log(`CP | Initializing Cortex Prime`)

  game.cortexprime = {
    CortexPrimeActor,
    CortexPrimeItem
  }

  CONFIG.Actor.entityClass = CortexPrimeActor
  CONFIG.Item.entityClass  = CortexPrimeItem
  CONFIG.Dice.terms['p']   = PlotPoint

  registerHandlebarHelpers()
  preloadHandlebarsTemplates()
  registerSettings()

  Actors.unregisterSheet("core", ActorSheet)
  Actors.registerSheet("cortexprime", CortexPrimeActorSheet, { makeDefault: true })

  Items.unregisterSheet("core", ItemSheet)
  Items.registerSheet("cortexprime", CortexPrimeItemSheet, { makeDefault: true })

  cortexPrimeHooks()
})