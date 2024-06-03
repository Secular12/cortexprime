import { setThemeProperties } from './setThemeProperties.js'

export default ({ payload, type }) => {
  switch (type) {
    case 'setThemeProperties':
      setThemeProperties()
    default:
      break
  }
}
