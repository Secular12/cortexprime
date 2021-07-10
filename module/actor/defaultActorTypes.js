export default {
  0: {
    hasPlotPoints: true,
    name: 'PC',
    traitSets: {
      0: {
        description: 'Represents background, personality, or roles in the game.',
        id: '_1',
        label: 'Distinctions',
        shutdown: false,
        traits: {
          0: {
            dice: {
              value: {
                0: '8'
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
        settings: {
          hasCustomTraits: false,
          hasDescription: false,
          hasDice: true,
          diceConsumable: false,
          hasLabels: true,
          hasName: true,
          hasSfx: true,
          hasSubTraits: false,
          hasTags: false
        }
      }
    }
  },
  1: {
    hasPlotPoints: false,
    name: 'Minor GMC'
  }
}