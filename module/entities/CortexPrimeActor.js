import { localizer } from '../scripts/foundryHelpers.js'

export class CortexPrimeActor extends Actor {
  // add or subtract plot point value assigned to the actor by specified amount
  async changePpBy (value, directChange = false) {
    // ensure current value is an integer
    const currentValue = +(this.system.pp.value ?? 0)

    const newValue = currentValue + value

    // action only taken if value will be different and won't result in negative plot points
    if (currentValue !== newValue && newValue >= 0) {
      await this.updatePpValue(newValue)
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
  async createPpMessage (changeType, value, total) {
    const message = await foundry.applications.handlebars.renderTemplate(`systems/cortexprime/templates/chat/change-pp.html`, {
      changeType,
      speaker: game.user,
      target: this,
      total,
      value
    })

    ChatMessage.create({ content: message })
  }

  // Update plot point value of the actor
  async updatePpValue (value) {
    await this.update({
      'system.pp.value': value
    })
  }

  getDiceObjectForTrait(trait) {
    let diceObj = null
    const myTraitSets = this.system.actorType.traitSets
    for (const i in myTraitSets) {
      let myTraits = myTraitSets[i].traits
      for (const j in myTraits) {
        let myTrait = myTraits[j]
        let myName = myTrait.name
        if(myName.toLowerCase() == trait.toLowerCase() ) {
          diceObj = this._countDice(myTraits[j].dice.value)
          return diceObj
        }
      }
    }
    return diceObj
  }

  _countDice(diceObj){
    let diceCounter = {}
    for (const [index, sides] of Object.entries(diceObj)) {
      if (diceCounter.hasOwnProperty(sides)) {
        diceCounter[sides] += 1
      } else {
        diceCounter[sides] = 1
      }
    }
    return diceCounter
  }
}
