export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'actor-sheet/sidebar',
    'actor-sheet/simple-traits',
    'actor-sheet/traits',
    'actor-sheet/trait-sets',
    'breadcrumbs',
    'dice/pool',
    'dice/select',
    'dice/select-options',
    'mc-help',
    'pp',
    'remove-button',
    'reorder',
    'settings/actor-types',
    'settings/actor-type',
    'settings/trait',
    'settings/trait-set',
    'settings/simple-trait',
    'signature-assets',
    'trait-sets',
    'settings/value-types/dice',
    'settings/value-types/number',
    'settings/value-types/sfx',
    'settings/value-types/sub-traits',
    'settings/value-types/text',
    'value-types/dice',
    'value-types/number',
    'value-types/sfx',
    'value-types/sub-traits',
    'value-types/text',
  ]
    .map(template => `systems/cortexprime/templates/partials/${template}.html`)

  return loadTemplates(templatePaths)
}
