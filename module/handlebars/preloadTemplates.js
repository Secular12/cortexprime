export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'actor-sheet/sidebar',
    'actor-sheet/simple-traits',
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
    'settings/trait-set',
    'settings/simple-trait',
    'signature-assets',
    'trait-sets',
    'settings/value-types/dice',
    'settings/value-types/number',
    'settings/value-types/tags',
    'settings/value-types/text',
    'value-types/dice',
    'value-types/number',
    'value-types/tags',
    'value-types/text',
  ]
    .map(template => `systems/cortexprime/templates/partials/${template}.html`)

  return loadTemplates(templatePaths)
}
