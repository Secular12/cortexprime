import ready from './ready.js'
import renderSceneControls from './renderSceneControls.js'

export default () => {
  Hooks.on('ready', ready)
  Hooks.on('renderSceneControls', renderSceneControls)
}