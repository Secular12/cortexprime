export const preloadHandlebarsTemplates = async function () {
  const templatePaths = [
    'actor/actor_type_select',
  ]
    .map(template => `systems/cortexprime/system/templates/partials/${template}.html`)

  return loadTemplates(templatePaths)
}
