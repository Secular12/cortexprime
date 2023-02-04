import { localizer } from '../lib/helpers.js'
import Logger from '../lib/Logger'

export class DicePool extends FormApplication {
  constructor () {
    super()
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'DicePool'],
      closeOnSubmit: false,
      height: 'auto',
      id: 'DicePool',
      left: 20,
      resizable: false,
      submitOnClose: true,
      submitOnChange: true,
      template: 'systems/cortexprime/system/templates/DicePool.html',
      title: localizer('CP.DicePool'),
      top: 500,
      width: 360
    })
  }

  getData () {
    const data = {}

    Logger()('DicePool.getData data:', data)

    return data
  }

  _updateObject (event, formData) {
    const expandedData = expandObject(formData)

    Logger()(
      'DicePool._updateObject event, expandedData:',
      event,
      expandedData
    )
  }

  activateListeners (html) {
    super.activateListeners(html)
  }

  async toggle () {
    if (!this.rendered) {
      await this.render(true)
    } else {
      this.close()
    }
  }
}
