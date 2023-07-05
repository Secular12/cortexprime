import { localizer } from '../lib/helpers'
import Logger from '../lib/Logger'

const Log = Logger()

export default class CpTraitSettings extends FormApplication {
  constructor() {
    super()

    const traitSettings = game.settings.get('cortexprime', 'itemTypes')

    this.traitSettings = traitSettings

    Log('CpTraitSettings.constructor traitSettings', traitSettings)
  }

  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'TraitSettings',
      left: 400,
      resizable: false,
      scrollY: ['#TraitSettings-form-body'],
      submitOnChange: false,
      subitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpTraitSettings.html',
      title: localizer('CP.TraitSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const data = this.traitSettings

    Log('CPTraitSettings.getData data:', data)

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = expandObject(formData)

    Log('CPTraitSettings._updateSettings expandedData:', expandedData)
    
    await this.save(expandedData)
  }

  activateListeners(html) {
    super.activateListeners(html)
  }
}