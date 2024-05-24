export default (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass',
  ]

  return new Handlebars.SafeString(
    `<div class="field field-checkbox${
      options.hash.disabled === true ? ' field-disabled' : ''
    }${options.hash.class ? ` ${options.hash.class}` : ''
    }">${
      options.hash.label ? '<label' : '<div'
    } class="field-wrapper flex gap-1${
      options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : ''
    }">`
    +`<input type="checkbox" ${
      value ? 'checked ' : ''
    }${Object.entries(options.hash)
      .reduce((attributes, [key, value,]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required',].includes(key) && value === true) {
          return [...attributes, key,]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-checkbox-input ${value}"`
          return attributes
        }

        const val = value ?? null

        return [...attributes, val || val === 0 ? `${key}="${value}"` : '',]
      }, ['class="field-checkbox-input"',])
      .join(' ')
    }>${
      options.hash.label ? '<span class="field-label' : ''
    }${options.hash.label && options.hash.labelClass ? ` ${options.hash.labelClass}` : ''
    }${options.hash.label ? `">${options.hash.label}</span>` : ''
    }${options.hash.label ? '</label>' : '</div>'
    }${options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : ''
    }</div>`
  )
}
