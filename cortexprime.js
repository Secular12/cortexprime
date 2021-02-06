// // Import Modules
import { CP } from './module/config.js'
import { CortexPrimeActor } from './module/entities/CortexPrimeActor.js'
// import { CortexPrimeItem } from './module/entities/CortexPrimeItem.js'
import PlotPoint from './module/PlotPoint.js'
import { preloadHandlebarsTemplates } from './module/handlebars/preloadTemplates.js'
import { registerHandlebarHelpers } from './module/handlebars/helpers.js'
import { registerSettings } from './module/settings/settings.js'
import { CortexPrimeActorSheet } from "./module/actor/actor-sheet.js"
import cortexPrimeHooks from './module/cortexPrimeHooks.js'
// import { CortexPrimeItem } from "./item/item.js"
// import { CortexPrimeItemSheet } from "./item/item-sheet.js"

Hooks.once('init', () => {
  console.log(`CP | Initializing Cortex Prime`)

  CONFIG.CP = CP

  game.cortexprime = {
    CortexPrimeActor
    // CortexPrimeItem
  }

  // Overwrite method prototypes
  // e.g. Combat.prototype.rollInitiative = rollInitiative

  // Overwrite custom classes
  CONFIG.Actor.entityClass = CortexPrimeActor
  CONFIG.Dice.terms['p'] = PlotPoint
  // CONFIG.Item.entityClass = CortexPrimeItem

  registerHandlebarHelpers()
  preloadHandlebarsTemplates()

  // Register custom system settings
  registerSettings()

//   // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet)
  Actors.registerSheet("cortexprime", CortexPrimeActorSheet, { makeDefault: true })
//   Items.unregisterSheet("core", ItemSheet)
//   Items.registerSheet("cortexprime", CortexPrimeItemSheet, { makeDefault: true })
  cortexPrimeHooks()
})