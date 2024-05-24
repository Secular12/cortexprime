import { getDieIcon, } from './dice.js'
import { addListeners, } from './helpers.js'

const getAppendDiceContent = ({ isDefault, dieRating, key, }) => {
  return `<div class="die-wrapper${
    isDefault ? ' default' : ''
  }"${
    key ? ` data-key="${key}"` : ''
  }>`
    + `<div class="dice-container">${
      getDieIcon(dieRating, 'effect')
    }</div>`
    + '</div>'
}

export default resolve => ([$html,]) => {
  const $addToTotal = $html.querySelector('.DicePicker-add-to-total')
  const $addToEffect = $html.querySelector('.DicePicker-add-to-effect')
  const $effectDiceContainer = $html.querySelector('.DicePicker-effect-value .dice-container')
  const $resetSelection = $html.querySelector('.DicePicker-reset')

  const setSelectionOptionsDisableTo = value => {
    $addToTotal.disabled = value ?? !$addToTotal.disabled
    $addToEffect.disabled = value ?? !$addToEffect.disabled
  }

  const setSelectionDisable = () => {
    const $selectedDice = $html.querySelectorAll('.DicePicker-die-result.selected')
    const $usedDice = $html.querySelectorAll('.DicePicker-die-result[data-type="effect"], .DicePicker-die-result[data-type="chosen"]')

    setSelectionOptionsDisableTo(!($selectedDice.length > 0))

    $resetSelection.disabled = !($selectedDice.length > 0 || $usedDice.length > 0)
  }

  const deselectEffectDie = ($effectDie, $selectedDie) => {
    $selectedDie.dataset.type = 'unchosen'

    const $selectedCpDie = $selectedDie.querySelector('.cp-die')

    $selectedCpDie.classList.toggle('cp-unchosen')
    $selectedCpDie.classList.toggle('cp-effect')

    $effectDie.remove()

    const $effectDice = $effectDiceContainer.querySelectorAll('.die-wrapper')

    if ($effectDice.length === 0) {
      const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4', })

      $effectDiceContainer
        .insertAdjacentHTML('beforeend', dieContent)
    }

    setSelectionDisable()
  }

  $addToEffect
    .addEventListener('click', () => {
      const $diceForEffect = $html.querySelectorAll('.DicePicker-die-result.selected')

      if ($diceForEffect.length > 0) {
        $effectDiceContainer.querySelector('.default')?.remove()

        $diceForEffect.forEach($die => {
          const $cpDie = $die.querySelector('.cp-die')
          const dieRating = $die.dataset.dieRating
          const key = $die.dataset.key

          $die.dataset.type = 'effect'
          $die.classList.remove('selected')

          $cpDie.classList.toggle('cp-selected')
          $cpDie.classList.toggle('cp-effect')

          const dieContent = getAppendDiceContent({ dieRating, key, })

          $effectDiceContainer
            .insertAdjacentHTML('beforeend', dieContent)
        })

        setSelectionDisable()
      }
    })

  $addToTotal
    .addEventListener('click', () => {
      const $diceForTotal = $html.querySelectorAll('.DicePicker-die-result.selected')

      $diceForTotal.forEach($die => {
        const $cpDie = $die.querySelector('.cp-die')
        const value = parseInt($die.dataset.value, 10)

        $die.dataset.type = 'chosen'
        $die.classList.remove('selected')

        $cpDie.classList.toggle('cp-chosen')
        $cpDie.classList.toggle('cp-selected')

        const $totalValue = $html.querySelector('.DicePicker-total-value')

        const currentValue = parseInt($totalValue.textContent, 10)

        $totalValue.textContent = value + currentValue
      })

      setSelectionDisable()
    })

  $html
    .closest('.window-app.dialog')
    .querySelector('.header-button.close')
    .addEventListener('click', event => {
      event.preventDefault()

      const values = { dice: [], total: 0, effectDice: [], }

      $html
        .querySelectorAll('.DicePicker-die-result')
        .forEach($die => {
          const dieRating = $die.dataset.dieRating
          const resultGroupIndex = parseInt($die.dataset.resultGroupIndex, 10)
          const type = $die.dataset.type
          const value = parseInt($die.dataset.value, 10)

          const groupValues = values.dice[resultGroupIndex] ?? []

          values.dice[resultGroupIndex] = [
            ...groupValues,
            {
              dieRating,
              type: type === 'hitch' ? 'hitch' : 'unchosen',
              value,
            },
          ]
        })

      resolve(values)
    })

  $resetSelection
    .addEventListener('click', $selection => {
      $html
        .querySelectorAll('.DicePicker-die-result:not([data-type="hitch"])')
        .forEach($target => {
          $target.classList.remove('selected')
          $target.dataset.type = 'unchosen'

          const $cpDie = $target.querySelector('.cp-die')

          $cpDie.classList.remove('cp-chosen', 'cp-effect', 'cp-selected')
          $cpDie.classList.add('cp-unchosen')
        })

      $html
        .querySelector('.DicePicker-total-value')
        .textContent = '0'

      const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4', })

      $effectDiceContainer.innerHtml = dieContent

      setSelectionOptionsDisableTo(true)
      $selection.disabled = true
    })

  $effectDiceContainer
    .addEventListener('mouseup', event => {
      const $effectDie = event.target.closest('.die-wrapper')

      if ($effectDie && event.button === 2) {
        const key = $effectDie.dataset.key

        const $selectedDie = $html
          .querySelector(`.DicePicker-result-groups [data-key="${key}"]`)

        deselectEffectDie($effectDie, $selectedDie)
      }
    })

  addListeners(
    $html,
    '.DicePicker-result-groups',
    'click',
    event => {
      const $chosenDie = event.target.closest('[data-type="chosen"]')
      const $effectDie = event.target.closest('[data-type="effect"]')
      const $unchosenDie = event.target.closest('[data-type="unchosen"]')

      if ($chosenDie) {
        const value = parseInt($chosenDie.dataset.value, 10)

        $chosenDie.dataset.type = 'unchosen'

        const $cpDie = $chosenDie.querySelector('.cp-die')

        $cpDie.classList.toggle('cp-chosen')
        $cpDie.classList.toggle('cp-unchosen')

        const $totalValue = $html.querySelector('.DicePicker-total-value')

        const currentValue = parseInt($totalValue.textContent, 10)

        $totalValue.textContent = currentValue - value

        setSelectionDisable()
      }

      if ($effectDie) {
        const key = $effectDie.dataset.key

        const $currentEffectDie = $effectDiceContainer.querySelector(`[data-key="${key}"]`)

        deselectEffectDie($currentEffectDie, $effectDie)
      }

      if ($unchosenDie) {
        $unchosenDie.classList.toggle('selected')

        const $cpDie = $unchosenDie.querySelector('.cp-die')

        $cpDie.classList.toggle('cp-selected')
        $cpDie.classList.toggle('cp-unchosen')

        setSelectionDisable()
      }
    }
  )
}
