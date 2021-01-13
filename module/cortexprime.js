// Import Modules
import { CortexPrimeActor } from "./actor/actor.js"
import { CortexPrimeActorSheet } from "./actor/actor-sheet.js"
import { CortexPrimeItem } from "./item/item.js"
import { CortexPrimeItemSheet } from "./item/item-sheet.js"
import { preloadHandlebarsTemplates } from './preloadTemplates.js'

Hooks.once('init', async function() {

  game.cortexprime = {
    CortexPrimeActor,
    CortexPrimeItem
  }

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  }

  // Define custom Entity classes
  CONFIG.Actor.entityClass = CortexPrimeActor
  CONFIG.Item.entityClass = CortexPrimeItem

  preloadHandlebarsTemplates()

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet)
  Actors.registerSheet("cortexprime", CortexPrimeActorSheet, { makeDefault: true })
  Items.unregisterSheet("core", ItemSheet)
  Items.registerSheet("cortexprime", CortexPrimeItemSheet, { makeDefault: true })

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = ''
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg]
      }
    }
    return outStr
  })

  Handlebars.registerHelper('eachdice', function(block) {
    let accum = '';
    for (let i = 4; i <= 12; i = i + 2)
      accum += block.fn(i)
    return accum
  })

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase()
  })
})