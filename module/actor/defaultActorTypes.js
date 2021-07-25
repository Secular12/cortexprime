export default {
  0: {
    hasAssets: true,
    hasComplications: true,
    hasNotesPage: true,
    hasPlotPoints: true,
    id: '_1',
    name: 'Character',
    traitSets: {
      0: {
        description: null,
        hasDescription: false,
        id: '_11',
        label: 'Distinctions',
        shutdown: false,
        traits: {
          0: {
            dice: {
              value: {
                0: '8'
              }
            },
            id: '_111',
            label: '',
            name: 'Distinction 1',
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
            dice: {
              value: {
                0: '8'
              }
            },
            id: '_112',
            label: '',
            name: 'Distinction 2',
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
            dice: {
              value: {
                0: '8'
              }
            },
            id: '_113',
            label: '',
            name: 'Distinction 3',
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
          hasDescription: false,
          hasDice: true,
          hasLabels: true,
          hasSfx: true,
          hasSubTraits: false,
          hasSubTraitDice: true,
          subTraitDiceConsumable: false,
        }
      }
    }
  },
  1: {
    hasAssets: true,
    hasComplications: true,
    hasNotesPage: true,
    hasPlotPoints: true,
    id: '_2',
    name: 'Scene',
    simpleTraits: {
      0: {
        dice: {
          id: '_21',
          value: {
            0: '6',
            1: '6'
          }
        },
        hasDescription: false,
        label: 'Doom Pool',
        settings: {
          diceConsumable: false,
          editable: true,
          valueType: 'dice'
        }
      }
    },
    traitSets: {
      0: {
        description: null,
        hasDescription: false,
        id: '_21',
        label: 'Extras',
        shutdown: false,
        traits: {},
        settings: {
          hasDescription: false,
          hasDice: true,
          hasLabels: false,
          hasSfx: false,
          hasSubTraits: false,
          hasSubTraitDice: true,
          subTraitDiceConsumable: false
        }
      },
      1: {
        description: null,
        hasDescription: false,
        id: '_22',
        label: 'Minor GMCs',
        shutdown: false,
        traits: {},
        settings: {
          hasDescription: true,
          hasDice: false,
          hasLabels: false,
          hasSfx: false,
          hasSubTraits: true,
          hasSubTraitDice: true,
          subTraitDiceConsumable: false
        }
      },
      2: {
        description: null,
        hasDescription: false,
        id: '_23',
        label: 'Mobs',
        shutdown: false,
        traits: {},
        settings: {
          hasDescription: true,
          hasDice: true,
          hasLabels: true,
          hasSfx: false,
          hasSubTraits: true,
          hasSubTraitDice: true,
          subTraitDiceConsumable: false
        }
      },
      3: {
        description: null,
        hasDescription: false,
        id: '_24',
        label: 'Bosses/Factions/Orgs',
        shutdown: false,
        traits: {},
        settings: {
          hasDescription: true,
          hasDice: true,
          hasLabels: true,
          hasSfx: true,
          hasSubTraits: true,
          hasSubTraitDice: true,
          subTraitDiceConsumable: false
        }
      }
    }
  }
}