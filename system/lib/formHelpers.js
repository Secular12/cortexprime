import { round } from './helpers.js'

export const diceSelectListener = function (html, addCb, changeCb, removeCb) {
  html
    .find('.new-die')
    .click((event) => {
      const { target } = event.currentTarget.dataset ?? {}

      addCb(event, { target })
    })
  
  html
    .find('.die-select')
    .change((event) => {
      const {
        index,
        target
      } = event.currentTarget.dataset ?? {}

      changeCb(event, {
        index: parseInt(index, 10),
        target,
        value: parseInt(event.currentTarget.value, 10)
      })
    })

  html
    .find('.die-select')
    .on('mouseup', (event) => {
      event.preventDefault()

      const {
        index,
        target
      } = event.currentTarget.dataset ?? {}

      if (event.button === 2) removeCb(event, {
        index: parseInt(index, 10),
        target
      })
    })
}

const numberFieldListener = function (html) {
  html
    .find('.field-number .field-input')
    .change(event => {
      const el = event.target
      
      if (!el.required && !el.value && el.value !== 0) return

      const max = el.max || el.max === 0 ? +el.max : null
      const min = el.min || el.min === 0 ? +el.min : null
      const step = +el.step
      const value = +el.value
      
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
}

export const fieldListeners = (html) => {
  numberFieldListener(html)
}