import { CpItemSheet, } from './documents/CpItemSheet.js'
import { CpActorSheet, } from './documents/CpActorSheet.js'
import { localizer, } from './lib/helpers.js'

export const registerSheets = () => {
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('cortexprime', CpActorSheet, {
    label: localizer('CP.ActorSheetLabel'),
    makeDefault: true,
  })

  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('cortexprime', CpItemSheet, {
    label: localizer('CP.ItemSheetLabel'),
    makeDefault: true,
  })
}
