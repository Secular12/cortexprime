export class CortexPrimeItem extends Item {
  prepareData () {
    super.prepareData()
  }

  get actor () {
    return this.options.actor || null
  }
}
