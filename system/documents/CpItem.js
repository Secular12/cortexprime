import Logger from '../lib/Logger'

const Assert = Logger('assert')
const Log = Logger()

export class CpItem extends Item {
  async _preCreate (data, options, user) {
    Log('CpItem._preCreate data, options, user', data, options, user)

    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

    Log('CpItem._preCreate itemTypeSettings', itemTypeSettings)

    const traitTypes = itemTypeSettings.traits
      .map(({ id, name }) => ({ id, name }))

    const subtraitTypes = itemTypeSettings.subtraits
      .map(({ id, name }) => ({ id, name }))

    if (data.type === 'Trait') {
      Assert(
        traitTypes?.length > 0,
        'CpItem._preCreate: There are no trait type options'
      )
    }

    if (data.type === 'Subtrait') {
      Assert(
        subtraitTypes?.length > 0,
        'CpItem._preCreate: There are no subtrait type options'
      )
    }

    const itemTypes = data.type === 'Trait'
      ? traitTypes
      : data.type === 'Subtrait'
        ? subtraitTypes
        : []

    if (itemTypes.length !== 1) return
    
    await this.updateSource({
      'system.itemType': itemTypes[0]
    })
  }
}