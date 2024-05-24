import { getDieIcon, } from '../dice.js'

const getAddButton = options => {
  return `<button class="btn btn-icon btn-icon-text btn-small ml-1 new-die${

    options.hash.disabled === true
      ? ' disabled'
      : ''
  }" ${
    options.hash.target ? `data-target="${options.hash.target}" ` : ''

  }${options.hash.disabled === true
    ? 'disabled '
    : ''
  }type="button">`
    + '<i class="fa fa-plus"></i>'
    + '</button>'
}

const getSelect = (options, { dieIndex, dieRating, removable, }) => {
  const diceOptions = [4, 6, 8, 10, 12,]
    .filter(rating => {
      return (
        !options.hash.minDieRating
        || rating >= options.hash.minDieRating
      ) && (
        !options.hash.maxDieRating
        || rating <= options.hash.maxDieRating
      )
    })
  return '<select '
    + `class="die-select${
      removable ? ' removable' : ''
    }${options.hash.disabled === true ? ' disabled' : ''
    }" ${
      options.hash.disabled === true ? 'disabled ' : ''
    }data-index="${dieIndex}" ${
      options.hash.target ? `data-target="${options.hash.target}" ` : ''

    }${options.hash.name
      ? ` name="${options.hash.name}"`
      : ''
    }>${
      diceOptions.reduce((selectOptions, rating) => {
        if (rating >= (options.hash.min ?? 4) && rating <= (options.hash.max ?? 12)) {
          return `${selectOptions
          }<option value="${rating}"${
            dieRating === rating ? ' selected>' : '>'
          }d${rating}`
        + '</option>'
        }

        return selectOptions
      }, '')
    }</select>`
}

export default (val, options) => {
  const type = options.hash.type ?? 'die-rating'
  const value = val
    ? typeof val === 'number'
      ? [val,]
      : val
    : options.hash.defaultDie
      ? [options.hash.defaultDie,]
      : []
  return new Handlebars.SafeString(
    `<div class="dice-${
      options.hash.displayOnly ? 'display' : 'select'
    }${options.hash.disabled === true ? ' field-disabled' : ''
    }${options.hash.class ? ` ${options.hash.class}` : ''
    }">${
      options.hash.label ? `<label class="field-label">${options.hash.label}</label>` : ''
    }<div class="dice-wrapper flex gap-0">`
    + `<div class="dice-container flex flex-wrap gap-0">${
      value.reduce((diceString, dieRating, dieIndex) => {
        return `${diceString
        }<div class="die-wrapper${
          options.hash.dieWrapperClass ? ` ${options.hash.dieWrapperClass}` : ''
        }">`
      + `<div class="die-container">${
        getDieIcon(dieRating, type)
      }</div>${

        options.hash.displayOnly
          ? ''
          : getSelect(options, {
            dieIndex,
            dieRating,
            removable: options.hash.allowNoDice || value?.length > 1,
          })
      }</div>`
      }, '')
    }</div>${

      !options.hash.displayOnly
      && (options.hash.allowMultipleDice || value.length === 0)
        ? getAddButton(options)
        : ''
    }</div>`
    + '</div>'
  )
}
