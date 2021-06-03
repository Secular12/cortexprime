export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'partials/actor-sheet/sidebar',
    'partials/actor-sheet/trait-sets',
    'partials/breadcrumbs',
    'partials/dice/pool',
    'partials/dice/select',
    'partials/dice/select-options',
    'partials/mc-help',
    'partials/pp',
    'partials/remove-button',
    'partials/reorder',
    'partials/settings/actor-types',
    'partials/settings/actor-type',
    'partials/settings/trait-set',
    'partials/settings/simple-trait',
    'partials/signature-assets',
    'partials/simple-trait',
    'partials/single-trait',
    'partials/trait-sets'
  ]
    .map(template => `systems/cortexprime/templates/${template}.html`)

  return loadTemplates(templatePaths)
}
