import Logger from '../../lib/Logger.js'
import { localizer } from '../scripts/foundryHelpers.js'

export class CpActor extends Actor {
  async _preCreate (data, options, user) {
    const actorTypeSettings = game.settings.get('cortexprime', 'actorTypes')

    Logger('debug')('CpActorSheet.getData actorTypes', actorTypeSettings)

    const actorTypes = actorTypeSettings.types
      .map(({ id, title }) => ({ id, title }))

    Logger('warn', 'assert')
      (actorTypes?.length > 0, 'CpActorSheet.getData: There are no actor type options')

    if (actorTypes?.length < 1 || actorTypes?.length > 1) return
    
    await this.updateSource({
      'system.actorType': actorTypes[0]
    })
  }

  // add or subtract plot point value assigned to the actor by specified amount
  async changePlotPointBy (value, directChange = false) {
    // ensure current value is an integer
    const currentValue = +(this.system.plotPoints ?? 0)

    const newValue = currentValue + value

    // action only taken if value will be different and won't result in negative plot points
    if (currentValue !== newValue && newValue >= 0) {
      await this.updatePlotPoints(newValue)
      // determin if it is spending a plot point or receiving a plot point
      const valueChangeType = currentValue > newValue
          ? directChange
            ? localizer('Removed')
            : localizer('Spent')
          : directChange
            ? localizer('Added')
            : localizer('Received')

      await this.createPpMessage(valueChangeType, Math.abs(currentValue - newValue), newValue)
    }
  }

  // Send a message to the chat on the pp change
  async createPlotPointMessage (changeType, value, total) {
    const message = await renderTemplate(`systems/cortexprime/templates/chat/change-pp.html`, {
      changeType,
      speaker: game.user,
      target: this,
      total,
      value
    })

    ChatMessage.create({ content: message })
  }

  // Update plot point value of the actor
  async updatePlotpoints (value) {
    await this.updateSource({
      plotPoints: value
    })
  }
}
