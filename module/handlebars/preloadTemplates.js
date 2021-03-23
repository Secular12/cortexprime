export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'partials/dice/pool',
    'partials/dice/select',
    'partials/dice/select-options',
    'partials/mc-help',
    'partials/pp',
    'partials/settings-trait-sets',
    'partials/signature-assets',
    'partials/simple-trait',
    'partials/single-trait',
    'partials/trait-sets'
  ]

  return loadTemplates(
    templatePaths
      .map(template => `systems/cortexprime/templates/${template}.html`)
  )
}
