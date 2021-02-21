export class CortexPrimeActor extends Actor {
  async getPp() {
    const message = await renderTemplate('systems/cortexprime/templates/chat/get-pp.html', {
      target: this,
      speaker: game.user
    })

    ChatMessage.create({ content: message })

    const actorData = this.data

    await this.update({
      'data.pp.value': actorData.data.pp.value + 1
    })
  }

  async setActorTraitSets (data) {
    await this.update({
      'data.traitSets': data
    })
  }

  async spendPp() {
    const message = await renderTemplate('systems/cortexprime/templates/chat/spent-pp.html', {
      target: this,
      speaker: game.user
    })

    ChatMessage.create({ content: message })

    const actorData = this.data

    if (actorData.data.pp.value > 0) {
      await this.update({
        'data.pp.value': actorData.data.pp.value - 1
      })
    }
  }
}
