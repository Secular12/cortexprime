import GameConfiguration from './GameConfiguration'

export const registerSystemSettings = () => {
  game.settings.registerMenu('cortex', 'gameConfig', {
    hint: 'SETTINGS.gameConfigH',
    icon: 'fas fa-globe',
    label: 'SETTINGS.gameConfigL',
    name: 'SETTINGS.gameConfigN',
    restricted: true,
    type: GameConfiguration
  })
}
