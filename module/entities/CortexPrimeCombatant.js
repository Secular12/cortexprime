import { localizer } from '../scripts/foundryHelpers.js'

const SIDES_TO_ADDITION = {
    4: 1,
    6: 2,
    8: 3,
    10: 4,
    12: 5
}

export class CortexPrimeCombatant extends Combatant {
  getInitiativeRoll(formula) {
    let traits = game.settings.get('cortexprime', 'initiativeTraits').split(',').map( s => s.trim() )
      // get the actor
      let formulae = []
      let additive = 0
      let actor = this.actor
      // iterate over the traits
      traits.forEach((trait) => {
        let diceObj = actor.getDiceObjectForTrait(trait)
          if (diceObj != null) {
            let myFormula = ""
            for (const [sides, dice] of Object.entries(diceObj)) {
              additive += sides * dice
              myFormula = `${dice}d${sides}`
              formulae.push(myFormula)
            }
          }
      })
      // pull the trait values out of the actor and build the roll
      let myRollFormula = formulae.join(' + ')
      let myAdditivePercent = additive / 100.0
      myRollFormula = `${myRollFormula} + ${myAdditivePercent}`
      const myRoll = new Roll(myRollFormula)
      return myRoll
  }

}
