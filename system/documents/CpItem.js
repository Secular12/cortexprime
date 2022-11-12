export class CpItem extends Item {
  async _preCreate (data, options, user) {
    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

    Logger('debug')('CpItem._preCreate itemTypeSettings', itemTypeSettings)

    const itemTypes = itemTypeSettings.types
      .map(({ id, title }) => ({ id, title }))

    Logger('warn', 'assert')
      (itemTypes?.length > 0, 'CpItem._preCreate: There are no item type options')

    if (itemTypes?.length < 1 || itemTypes?.length > 1) return
    
    await this.updateSource({
      'system.type': itemTypes[0]
    })
  }
}