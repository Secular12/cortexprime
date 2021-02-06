export class CortexPrimeActor extends Actor {
  /**
   * @override
   */
  prepareBaseData() {
    // prepare derived asctor-specific data not dependant on Items or Active Effects
    const traitSets = game.settings.get("cortexprime", "traitSets")

    this.data.data.traitSets = Object.keys(traitSets).map(traitSet => {
      if (this.data.data.traitSets[traitSet]) {
        return this.data.data.traitSets[traitSet]
      }

      return traitSets[traitSet]
    })
  }

  /**
   * @override
   * Extends data from base Actor class
   */
  prepareData () {
    this.data = duplicate(this['_data'])

    if (!this.data.img)
      this.data.img = CONST.DEFAULT_TOKEN;
    if (!this.data.name)
      this.data.name = 'New ' + this.entity;

    this.prepareBaseData()

    // from Actor class
    this.prepareEmbeddedEntities()

    // from Actor class
    this.applyActiveEffects()

    this.prepareDerivedData()
  }

  prepareDerivedData () {
    // Apply final Actor data after all effect have been applied
  }

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
