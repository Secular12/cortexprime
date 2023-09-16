export default {
  subtraits: [
    {
      id: 'subtrait-power',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: true,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'SFX',
    },
    {
      id: 'subtrait-specialty',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: true,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Power Set',
      subtraitTypes: [
        'subtrait-power',
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-relationship',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: true,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Stress/Trauma',
      subtraitTypes: [
        'subtrait-stress',
        'subtrait-trauma',
      ],
    },
    {
      id: 'trait-talent',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [
        { label: 'Trigger' },
        { label: 'Effect' },
      ],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: true,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Talent',
      subtraitTypes: [],
    },
    {
      id: 'trait-trauma',
      allowMultipleDice: false,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
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
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
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