import { CpItemAssetSheet } from '../documents/CpItemAssetSheet.js'
import { CpActorCharacterSheet } from '../documents/CpActorCharacterSheet.js'

export const registerSheets = () => {
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet('cortexprime', CpActorCharacterSheet, {
    label: 'ActorCharacterSheetLabel',
    makeDefault: true,
    types: ['character']
  })

  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet('cortexprime', CpItemAssetSheet, {
    label: 'ItemAssetSheetLabel',
    makeDefault: true,
    types: ['asset']
  })
}
