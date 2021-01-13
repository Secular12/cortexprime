export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'die-icon',
    'die-sides-options',
    'die-select'
  ]

  return loadTemplates(templatePaths.map(template => `systems/cortexprime/templates/partials/${template}.html`))
}
