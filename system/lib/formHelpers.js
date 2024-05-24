import { addListeners, round, } from './helpers.js'

export const diceSelectListener = ($html, { addDie, changeDie, removeDie, }) => {

  if (addDie) {
    addListeners(
      $html,
      '.new-die',
      'click',
      event => {
        const { target, } = event.currentTarget.dataset ?? {}
        addDie(event, { target, })
      }
    )
  }

  if (changeDie) {
    addListeners(
      $html,
      '.die-select',
      'change',
      event => {
        const {
          index,
          target,
        } = event.currentTarget.dataset ?? {}

        changeDie(event, {
          index: parseInt(index, 10),
          target,
          value: parseInt(event.currentTarget.value, 10),
        })
      }
    )
  }

  if (removeDie) {
    addListeners(
      $html,
      '.die-select.removable',
      'mouseup',
      event => {
        event.preventDefault()

        const {
          index,
          target,
        } = event.currentTarget.dataset ?? {}

        if (event.button === 2) removeDie(event, {
          index: parseInt(index, 10),
          target,
        })
      }
    )
  }
}

const numberFieldListener = $html => {
  $html
    .querySelectorAll('.field-number .field-input')
    .forEach($numberInput => {
      $numberInput
        .addEventListener('change', event => {
          const el = event.target

          if (!el.required && !el.value && el.value !== 0) return

          const max = el.max || el.max === 0 ? Number(el.max) : null
          const min = el.min || el.min === 0 ? Number(el.min) : null
          const step = Number(el.step)
          const value = Number(el.value)

          if ((min || min === 0) && value < min) {
            el.value = min
            return
          }

          if ((max || max === 0) && value > max) {
            el.value = max
            return
          }

          if (step) {
            el.value = round(value, step, min ?? 0)
          }
        })
    })
}

export const fieldListeners = html => {
  numberFieldListener(html)
}
