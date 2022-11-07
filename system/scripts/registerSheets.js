import { CpItemSheet } from '../documents/CpItemSheet.js'
import { CpActorSheet } from '../documents/CpActorSheet.js'

export const registerSheets = () => {
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('cortexprime', CpActorSheet, {
    label: 'ActorSheetLabel',
    makeDefault: true,
  })

  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('cortexprime', CpItemSheet, {
    label: 'ItemSheetLabel',
    makeDefault: true,
  })
}
