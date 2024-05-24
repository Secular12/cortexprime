import { camelCasetoKebabCase, } from './helpers'
import presetThemes from '../lib/presetThemes'

export const setThemeProperties = properties => {
  const $root = document
    .querySelector(':root')

  if (!properties) {
    const { selectedTheme, customList: customThemeList, } = game.settings.get('cortexprime', 'themes')

    properties = presetThemes[selectedTheme] ?? customThemeList[selectedTheme] ?? {}
  }

  const { borderProperties, mainProperties, } = Object.entries(properties)
    .reduce((acc, [property, value,]) => {
      const isColor = property?.endsWith('_color')

      if (property?.startsWith('border_')) {
        const splitProperty = property.split('_')

        const namespace = splitProperty[1]
        const prop = splitProperty[2]
        value = isColor ? (value || 'transparent') : value

        acc.borderProperties = {
          ...acc.borderProperties,
          [namespace]: {
            ...(acc.borderProperties[namespace] ?? {}),
            [prop]: value,
          },
        }
      } else {
        if (property?.endsWith('_rem')) {
          const splitProperty = property.split('_rem')

          property = splitProperty[0]

          const numValue = parseInt(value, 10) || 0

          value = numValue === 0
            ? 0
            : `${numValue / 16}rem`
        } else if (property?.endsWith('_image')) {
          const splitProperty = property.split('_image')

          property = `${splitProperty[0]}Image`

          value = value
            ? value.startsWith('http')
              ? `url('${value}')`
              : `url('/${value}')`
            : 'none'
        } else if (isColor) {
          const splitProperty = property.split('_color')

          property = `${splitProperty[0]}Color`

          value = value || 'transparent'
        } else if (property?.endsWith('_px')) {
          const splitProperty = property.split('_px')

          property = splitProperty[0]
          value = `${value}px`
        }

        acc.mainProperties.push([property, value,])
      }

      return acc
    }, { borderProperties: {}, mainProperties: [], })

  Object.entries(borderProperties).forEach(([namespace, values,]) => {
    const position = values.position ?? 'all'
    const width = values.width ?? 1

    let widthValue

    switch (position) {
      case 'none':
        widthValue = '0'
        break
      case 'bottom':
        widthValue = `0 0 ${width}px`
        break
      case 'top':
        widthValue = `${width}px 0 0`
        break
      case 'left':
        widthValue = `0 0 0 ${width}px`
        break
      case 'right':
        widthValue = `0 ${width}px 0 0`
        break
      case 'top-and-bottom':
        widthValue = `${width}px 0 ${width}px`
        break
      case 'left-and-right':
        widthValue = `0 ${width}px 0`
        break
      default:
        widthValue = `${width}px`
    }

    $root
      .style
      .setProperty(
        `--${camelCasetoKebabCase(namespace)}-border`,
        `${values.style ?? 'solid'} ${values.color ?? 'black'}`
      )

    $root
      .style
      .setProperty(
        `--${camelCasetoKebabCase(namespace)}-border-width`,
        widthValue
      )
  })

  mainProperties.forEach(([property, value,]) => {
    $root
      .style
      .setProperty(`--${camelCasetoKebabCase(property)}`, value)
  })
}
