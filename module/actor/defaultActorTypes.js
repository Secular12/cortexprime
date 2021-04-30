export default {
  0: {
    hasPlotPoints: true,
    name: 'PC',
    traitSets: {
      0: {
        description: 'Represents background, personality, or roles in the game.',
        label: 'Distinctions',
        shutdown: false,
        traits: {
          description: '',
          0: {
            dice: {
              0: {
                current: 8,
                value: 8
              }
            },
            label: 'Distinction 1',
            name: '',
            sfx: {
              0: {
                label: 'Hinder',
                description: 'Gain a PP when you switch out this distinction\'s d8 for a d4.',
                unlocked: true
              }
            },
            shutdown: false
          },
          1: {
            description: '',
            dice: {
              0: {
                current: 8,
                value: 8
              }
            },
            label: 'Distinction 2',
            name: '',
            sfx: {
              0: {
                label: 'Hinder',
                description: 'Gain a PP when you switch out this distinction\'s d8 for a d4.',
                unlocked: true
              }
            },
            shutdown: false
          },
          2: {
            description: '',
            dice: {
              0: {
                current: 8,
                value: 8
              }
            },
            label: 'Distinction 3',
            name: '',
            sfx: {
              0: {
                label: 'Hinder',
                description: 'Gain a PP when you switch out this distinction\'s d8 for a d4.',
                unlocked: true
              }
            },
            shutdown: false
          }
        },
        traitSettings: {
          diceSettings: {
            defaultDice: {
              0: {
                current: 8,
                value: 8
              }
            },
            depletable: false,
            has: true,
            maxDice: 1,
            maxDieRating: 8,
            minDice: 1,
            minDieRating: 8
          },
          hasCustomTraits: false,
          hasName: true,
          sfxSettings: {
            has: true,
            defaultUnlocked: true
          },
          subTraitSettings: {
            has: false
          },
          tagSettings: {
            has: false
          }
        }
      }
    }
  },
  1: {
    hasPlotPoints: false,
    name: 'Minor GMC'
  }
}