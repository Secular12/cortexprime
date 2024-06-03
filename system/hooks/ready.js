import { DicePool } from '../documents/DicePool.js'
import presetThemes from '../lib/presetThemes.js'
import { setThemeProperties } from '../lib/setThemeProperties.js'

export default async () => {
  game.cortexprime.DicePool = new DicePool()

  const themes = game.settings.get('cortexprime', 'themes')

  const themeOptions = {
    ...presetThemes,
    ...themes.customList,
  }

  setThemeProperties(themeOptions[themes.selectedTheme])
}
