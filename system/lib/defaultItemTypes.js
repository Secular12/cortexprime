export default {
  subtraits: [
    {
      id: 'subtrait-power',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 6,
      name: 'Power',
    },
    {
      id: 'subtrait-sfx',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: false,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: true,
      maxDieRating: null,
      minDieRating: null,
      name: 'SFX',
    },
    {
      id: 'subtrait-specialty',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 6,
      minDieRating: 6,
      name: 'Specialty',
    },
    {
      id: 'subtrait-specialty-split',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 8,
      name: 'Specialty (Split)',
    },
    {
      id: 'subtrait-stress',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Stress',
    },
    {
      id: 'subtrait-trait-statement',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Trait Statement',
    },
    {
      id: 'subtrait-trauma',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Trauma',
      subtraitTypes: [],
    },
  ],
  traits: [
    {
      id: 'trait-ability',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: true,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 6,
      name: 'Ability',
      subtraitTypes: [
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-affiliation',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 10,
      minDieRating: 6,
      name: 'Affiliation',
      subtraitTypes: [],
    },
    {
      id: 'trait-asset',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Asset',
      subtraitTypes: [],
    },
    {
      id: 'trait-attribute',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Attribute',
      subtraitTypes: [],
    },
    {
      id: 'trait-complication',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Complication',
      subtraitTypes: [],
    },
    {
      id: 'trait-distinction',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 8,
      minDieRating: 8,
      name: 'Distinction',
      subtraitTypes: [
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-hero-dice',
      allowMultipleDice: true,
      hasConsumableDice: true,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Hero Dice',
      subtraitTypes: [],
    },
    {
      id: 'trait-pool',
      allowMultipleDice: true,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Pool',
      subtraitTypes: [],
    },
    {
      id: 'trait-power-set',
      allowMultipleDice: true,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: null,
      minDieRating: null,
      name: 'Power Set',
      subtraitTypes: [
        'subtrait-power',
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-relationship',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Relationship',
      subtraitTypes: [],
    },
    {
      id: 'trait-reputation',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Reputation',
      subtraitTypes: [
        'subtrait-trait-statement',
      ],
    },
    {
      id: 'trait-resource',
      allowMultipleDice: true,
      hasConsumableDice: true,
      hasDescription: false,
      hasDice: true,
      hasHitches: false,
      hasLabel: false,
      hasTags: true,
      isRolledSeparately: true,
      isUnlockable: false,
      maxDieRating: 6,
      minDieRating: 6,
      name: 'Resource',
      subtraitTypes: [],
    },
    {
      id: 'trait-role',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Role',
      subtraitTypes: [],
    },
    {
      id: 'trait-signature-asset',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Signature Asset',
      subtraitTypes: [
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-skill-split',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 6,
      minDieRating: 4,
      name: 'Skill (Split)',
      subtraitTypes: [
        'subtrait-specialty-split',
      ],
    },
    {
      id: 'trait-skill',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Skill',
      subtraitTypes: [
        'subtrait-specialty',
      ],
    },
    {
      id: 'trait-specialty',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 8,
      name: 'Specialty',
      subtraitTypes: [],
    },
    {
      id: 'trait-stress',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Stress',
      subtraitTypes: [],
    },
    {
      id: 'trait-stress-and-trauma',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: null,
      minDieRating: null,
      name: 'Stress/Trauma',
      subtraitTypes: [
        'subtrait-stress',
        'subtrait-trauma',
      ],
    },
    {
      id: 'trait-talent',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: null,
      minDieRating: null,
      name: 'Talent',
    },
    {
      id: 'trait-trauma',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Trauma',
      subtraitTypes: [],
    },
    {
      id: 'trait-value',
      allowMultipleDice: false,
      hasConsumableDice: false,
      hasDescription: true,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Value',
      subtraitTypes: [
        'subtrait-trait-statement',
      ],
    },
  ],
}