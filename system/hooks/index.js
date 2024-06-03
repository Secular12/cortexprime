import ready from './ready.js'
import renderChatLog from './renderChatLog.js'
import renderChatMessage from './renderChatMessage.js'
import renderSceneControls from './renderSceneControls.js'

export default () => {
  Hooks.on('ready', ready)
  Hooks.on('renderChatLog', renderChatLog)
  Hooks.on('renderChatMessage', renderChatMessage)
  Hooks.on('renderSceneControls', renderSceneControls)
}
