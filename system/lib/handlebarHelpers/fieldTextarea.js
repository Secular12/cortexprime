export default (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'noEdit',
    'wrapperClass',
  ]

  return new Handlebars.SafeString(
    `<div class="field field-textarea${
      options.hash.noEdit ? ' field-view' : ''
    }${options.hash.disabled === true ? ' field-disabled' : ''
    }${options.hash.class ? ` ${options.hash.class}` : ''
    }">${
      options.hash.label && !options.hash.noEdit ? '<label' : '<div'
    } class="field-wrapper${
      options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : ''
    }">${
      options.hash.label ? '<span class="field-label' : ''
    }${options.hash.label && options.hash.labelClass ? ` ${options.hash.labelClass}` : ''
    }${options.hash.label ? `">${options.hash.label}</span>` : ''

    }${options.hash.noEdit
      ? `<p class="field-view-value">${value}</p>`
      : `<textarea ${
        Object.entries(options.hash)
          .reduce((attributes, [key, value,]) => {
            if (inputHashIgnore.includes(key)) return attributes

            if (['disabled', 'required',].includes(key) && value === true) {
              return [...attributes, key,]
            }

            if (key === 'inputClass') {
              attributes[0] = `class="field-input ${value}"`
              return attributes
            }

            const val = value ?? null

            return [...attributes, val || val === 0 ? `${key}="${value}"` : '',]
          }, ['class="field-input"',])
          .join(' ')
      }>${
        value ?? ''
      }</textarea>${
        options.hash.append ? `${options.hash.append}</div>` : ''}`
    }${options.hash.label && !options.hash.noEdit ? '</label>' : '</div>'
    }${options.hash.hint && !options.hash.noEdit ? `<p class="field-hint">${options.hash.hint}</p>` : ''
    }</div>`
  )
}
