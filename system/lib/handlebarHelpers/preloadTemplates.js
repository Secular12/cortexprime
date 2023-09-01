export const preloadHandlebarsTemplates = async () => {
  const templatePaths = [
    'fields/color',
    'fields/image',
    'ItemSettings/SubtraitPage',
    'ItemSettings/SubtraitType',
    'ItemSettings/TraitPage',
    'SortableListSection',
    'SortableListItem',
    'themes/body',
    'themes/buttons',
    'themes/dice',
    'themes/headings',
    'themes/inputs',
    'themes/misc',
    'themes/sections',
  ]
    .map(template => `systems/cortexprime/system/templates/partials/${template}.html`)

  return loadTemplates(templatePaths)
}
