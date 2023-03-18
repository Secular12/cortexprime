import { getDieIcon } from './dice.js'

const getAppendDiceContent = ({ isDefault, dieRating, key }) => {
  return '<div class="die-wrapper' + 
    (isDefault ? ' default' : '') +
    '"' +
    (key ? ` data-key="${key}"` : '') +
    '>' +
    '<div class="dice-container">' +
    getDieIcon(dieRating, 'effect') +
    '</div>' +
    '</div>'
}

export default (resolve) => (html) => {
  const $addToTotal = html.find('.DicePicker-add-to-total')
  const $addToEffect = html.find('.DicePicker-add-to-effect')
  const $closeButton = html
    .closest('.window-app.dialog')
    .find('.header-button.close')
  const $dieResults = html.find('.DicePicker-die-result')
  const $resetSelection = html.find('.DicePicker-reset')
  const $resultGroups = html.find('.DicePicker-result-groups')
  const $effectDiceContainer = html.find('.DicePicker-effect-value .dice-container')

  const setSelectionOptionsDisableTo = (value) => {
    $addToTotal.prop('disabled', value ?? !$addToTotal.prop('disabled'))
    $addToEffect.prop('disabled', value ?? !$addToEffect.prop('disabled'))
  }

  const setSelectionDisable = () => {
    const $selectedDice = html.find('.DicePicker-die-result.selected')
    const $usedDice = html.find('.DicePicker-die-result[data-type="effect"], .DicePicker-die-result[data-type="chosen"]')

    setSelectionOptionsDisableTo(!($selectedDice.length > 0))

    $resetSelection.prop('disabled', !($selectedDice.length > 0 || $usedDice.length > 0))
  }

  const deselectEffectDie = ($effectDie, $selectedDie) => {
    $selectedDie
      .attr('data-type', 'unchosen')

    $selectedDie.find('.cp-die').toggleClass('cp-unchosen cp-effect')

    $effectDie.remove()

    const $effectDice = $effectDiceContainer.find('.die-wrapper')

    if ($effectDice.length === 0) {
      const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4' })

      $effectDiceContainer
        .append(dieContent)
    }

    setSelectionDisable()
  }

  $addToEffect
    .click(function () {
      const $diceForEffect = html.find('.DicePicker-die-result.selected')

      if ($diceForEffect.length > 0) {

        $effectDiceContainer.find('.default')?.remove()

        $diceForEffect.each(function () {
          const $die = $(this)

          const dieRating = $die.data('die-rating')
          const key = $die.data('key')

          $die
            .attr('data-type', 'effect')
            .removeClass('selected')

          $die
            .find('.cp-die')
            .toggleClass('cp-selected cp-effect')

          const dieContent = getAppendDiceContent({ dieRating, key })

          $effectDiceContainer
            .append(dieContent)
        })

        setSelectionDisable()
      }
    })

  $addToTotal
    .click(function () {
      const $diceForTotal = html.find('.DicePicker-die-result.selected')

      $diceForTotal.each(function () {
        const $die = $(this)

        const value = parseInt($die.data('value'), 10)

        $die
          .attr('data-type', 'chosen')
          .removeClass('selected')
        
        $die
          .find('.cp-die')
          .toggleClass('cp-chosen cp-selected')

        const $totalValue = html.find('.DicePicker-total-value')

        const currentValue = parseInt($totalValue.text(), 10)
        
        $totalValue.text(value + currentValue)
      })

      setSelectionDisable()
    })

  $closeButton
    .click((event) => {
      event.preventDefault()

      const values = { dice: [], total: 0, effectDice: [] }

      $dieResults
        .each(function () {
          const $die = $(this)
          const dieRating = $die.data('die-rating')
          const resultGroupIndex = parseInt($die.data('result-group-index'), 10)
          const type = $die.data('type')
          const value = parseInt($die.data('value'), 10)

          const groupValues = values.dice[resultGroupIndex] ?? []

          values.dice[resultGroupIndex] = [
            ...groupValues,
            {
              dieRating,
              type: type === 'hitch' ? 'hitch' : 'unchosen',
              value,
            }
          ]
        })

      resolve(values)
    })

  $resetSelection
    .click(function () {
      $dieResults
        .not('[data-type="hitch"]')
        .each(function () {
          const $target = $(this)

          $target.removeClass('selected')
          $target.attr('data-type', 'unchosen')

          $target
            .find('.cp-die')
            .removeClass('cp-chosen cp-effect cp-selected')
            .addClass('cp-unchosen')
        })

      html
        .find('.DicePicker-total-value')
        .text(0)

        const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4' })

        $effectDiceContainer
          .html(dieContent)

      setSelectionOptionsDisableTo(true)
      $(this).prop('disabled', true)
    })

  $effectDiceContainer.on('mouseup', '.die-wrapper', function (event) {
    if (event.button === 2) {
      const $effectDie = $(this)

      const key = $effectDie.data('key')

      const $selectedDie = $resultGroups.find(`[data-key="${key}"]`)

      deselectEffectDie($effectDie, $selectedDie)
    }
  })

  $resultGroups.on('click', '[data-type="chosen"]', function () {
    const $selectedDie = $(this)

    const value = parseInt($selectedDie.data('value'), 10)

    $selectedDie
      .attr('data-type', 'unchosen')
    
    $selectedDie
      .find('.cp-die')
      .toggleClass('cp-chosen cp-unchosen')

    const $totalValue = html.find('.DicePicker-total-value')

    const currentValue = parseInt($totalValue.text(), 10)

    $totalValue.text(currentValue - value)

    setSelectionDisable()
  })

  $resultGroups.on('click', '[data-type="effect"]', function () {
    const $selectedDie = $(this)

    const key = $selectedDie.data('key')

    const $effectDie = $effectDiceContainer.find(`[data-key="${key}"]`)

    deselectEffectDie($effectDie, $selectedDie)
  })

  $resultGroups.on('click', '[data-type="unchosen"]', function () {
    const $target = $(this)

    $target.toggleClass('selected')

    $target.find('.cp-die').toggleClass('cp-selected cp-unchosen')

    setSelectionDisable()
  })
}