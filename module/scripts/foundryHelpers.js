export const getBorderWidth = (borderPosition, borderWidth) => {
  switch (borderPosition) {
    case 'a':
      return `${borderWidth}px ${borderWidth}px ${borderWidth}px ${borderWidth}px`
    case 'b':
      return `0 0 ${borderWidth}px 0`
    case 'l':
      return `0 0 0 ${borderWidth}px`
    case 'r':
      return `0 ${borderWidth}px 0 0`
    case 't':
      return `${borderWidth}px 0 0 0`
    case 'x':
      return `0 ${borderWidth}px 0 ${borderWidth}px`
    case 'y':
      return `${borderWidth}px 0 ${borderWidth}px 0`
  }
}

export const localizer = target => game.i18n.localize(target)

export const setCssVars = (theme) => {
  Object.entries(theme).forEach(([ key, value ]) => {
    if ('inputBorderPosition' === key) {
      value = getBorderWidth(value, theme.inputBorderWidth)
    }

    if ('sectionBorderPosition' === key) {
      value = getBorderWidth(value, theme.sectionBorderWidth)
    }

    if ([
      'bodyFontSize',
      'descriptorLabelFontSize',
      'inputBorderWidth',
      'inputLabelFontSize',
      'sectionBorderWidth',
      'sectionPrimaryTitleFontSize',
      'sectionSecondaryTitleFontSize',
      'separatorWeight',
      'sfxLabelFontSize',
      'subTraitLabelFontSize',
      'traitSubTitleFontSize',
      'traitTitleFontSize'
    ].includes(key)) {
      value = `${value}px`
    }

    if (['sheetBackgroundImage', 'sectionBackgroundImage'].includes(key)) {
      value = value
        ? value.startsWith('http')
          ? `url('${value}')`
          : `url('/${value}')`
        : 'none'
    }

    const property = `--cp-${key.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())}`

    document.body.style.setProperty(property, value)
  })
}
