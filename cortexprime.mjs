const displayToggleMethod = function (event) {
  const $toggler = $(this);
  const $chevronIcon = $toggler.find('.fa');
  const { parent, target } = event.currentTarget.dataset;

  $chevronIcon.toggleClass('fa-chevron-down fa-chevron-up');
  $toggler.closest(parent).find(target).toggleClass('hide');
};

const localizer = target => game.i18n.localize(target);

const rounding = (dir = null) => (number, increment, offset) => {
  const roundingDir = dir ?? 'round';
  if (!increment) return number
  return Math[roundingDir]((number - offset) / increment ) * increment + offset
};

const round = rounding();

const diceSelectListener = function (html, addCb, changeCb, removeCb) {
  html
    .find('.new-die')
    .click((event) => {
      const { target } = event.currentTarget.dataset ?? {};

      addCb(event, { target });
    });
  
  html
    .find('.die-select')
    .change((event) => {
      const {
        index,
        target
      } = event.currentTarget.dataset ?? {};

      changeCb(event, {
        index: parseInt(index, 10),
        target,
        value: parseInt(event.currentTarget.value, 10)
      });
    });

  html
    .find('.die-select')
    .on('mouseup', (event) => {
      event.preventDefault();

      const {
        index,
        target
      } = event.currentTarget.dataset ?? {};

      if (event.button === 2) removeCb(event, {
        index: parseInt(index, 10),
        target
      });
    });
};

const numberFieldListener = function (html) {
  html
    .find('.field-number .field-input')
    .change(event => {
      const el = event.target;
      
      if (!el.required && !el.value && el.value !== 0) return

      const max = el.max || el.max === 0 ? +el.max : null;
      const min = el.min || el.min === 0 ? +el.min : null;
      const step = +el.step;
      const value = +el.value;
      
      if ((min || min === 0) && value < min) {
        el.value = min;
        return
      }
      
      if ((max || max === 0) && value > max) {
        el.value = max;
        return
      }

      if (step) {
        el.value = round(value, step, min ?? 0);
      }
    });
};

const fieldListeners = (html) => {
  numberFieldListener(html);
};

var Logger = (method) => (...args) => {
  if (CONFIG.debug?.logs) {
      if (!method || typeof method === 'string') console[method || 'log'](...args);
      else args.forEach((arg, index) => {
          console[method?.[index] ?? 'log'](arg);
      });
  }
};

const diceIcons = {
  d4: (type = 'die-rating', number = 4) => (
    `<div class="cp-die cp-d4 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d4">' +
    '<path class="fill" d="M15 30 30 4H0l15 26z"></path>' +
    '<path class="stroke" d="M26.54 6 15 26 3.46 6h23.08M30 4H0l15 26L30 4z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'),
  d6: (type = 'die-rating', number = 6) => (
    `<div class="cp-die cp-d6 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d6">' +
    '<path class="fill" d="M4 4h22v22H4V4z"></path>' +
    '<path class="stroke" d="M24 6v18H6V6h18m2-2H4v22h22V4z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  ),
  d8: (type = 'die-rating', number = 8) => (
    `<div class="cp-die cp-d8 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d8">' +
    '<path class="fill" d="M1 15 15 1l14 14-14 14L1 15z"></path>' +
    '<path class="stroke" d="M15 3.83 26.17 15 15 26.17 3.83 15 15 3.83M15 1 1 15l14 14 14-14L15 1z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  ),
  d10: (type = 'die-rating', number = 10) => (
    `<div class="cp-die cp-d10 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d10">' +
    '<path class="fill" d="M3 8.07v13.86L15 28l12-6.07V8.07L15 2 3 8.07z"></path>' +
    '<path class="stroke" d="M15 2 3 8.07v13.86L15 28l12-6.07V8.07L15 2zm10 18.7-10 5.06L5 20.7V9.3l10-5.06L25 9.3v11.4z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  ),
  d12: (type = 'die-rating', number = 12) => (
    `<div class="cp-die cp-d12 cp-${type}">` +
    '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d12">' +
    '<path class="fill" d="M27 18.9v-7.8l-4.58-6.31L15 2.38 7.58 4.79 3 11.1v7.8l4.58 6.31L15 27.62l7.42-2.41L27 18.9z"></path>' +
    '<path class="stroke" d="m15 4.48 6.18 2.01L25 11.75v6.5l-3.82 5.26L15 25.52l-6.18-2.01L5 18.25v-6.5l3.82-5.26L15 4.48m0-2.1L7.58 4.79 3 11.1v7.8l4.58 6.31L15 27.62l7.42-2.41L27 18.9v-7.8l-4.58-6.31L15 2.38z"></path>' +
    '</svg>' +
    `<div class="number">${number}</div>` +
    '</div>'
  )
};

const getDieIcon = (rating, type, number) => {
  return diceIcons[`d${rating}`](type, number)
};

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
};

var dicePickerRender = (resolve) => (html) => {
  const $addToTotal = html.find('.DicePicker-add-to-total');
  const $addToEffect = html.find('.DicePicker-add-to-effect');
  const $closeButton = html
    .closest('.window-app.dialog')
    .find('.header-button.close');
  const $dieResults = html.find('.DicePicker-die-result');
  const $resetSelection = html.find('.DicePicker-reset');
  const $resultGroups = html.find('.DicePicker-result-groups');
  const $effectDiceContainer = html.find('.DicePicker-effect-value .dice-container');

  const setSelectionOptionsDisableTo = (value) => {
    $addToTotal.prop('disabled', value ?? !$addToTotal.prop('disabled'));
    $addToEffect.prop('disabled', value ?? !$addToEffect.prop('disabled'));
  };

  const setSelectionDisable = () => {
    const $selectedDice = html.find('.DicePicker-die-result.selected');
    const $usedDice = html.find('.DicePicker-die-result[data-type="effect"], .DicePicker-die-result[data-type="chosen"]');

    setSelectionOptionsDisableTo(!($selectedDice.length > 0));

    $resetSelection.prop('disabled', !($selectedDice.length > 0 || $usedDice.length > 0));
  };

  const deselectEffectDie = ($effectDie, $selectedDie) => {
    $selectedDie
      .attr('data-type', 'unchosen');

    $selectedDie.find('.cp-die').toggleClass('cp-unchosen cp-effect');

    $effectDie.remove();

    const $effectDice = $effectDiceContainer.find('.die-wrapper');

    if ($effectDice.length === 0) {
      const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4' });

      $effectDiceContainer
        .append(dieContent);
    }

    setSelectionDisable();
  };

  $addToEffect
    .click(function () {
      const $diceForEffect = html.find('.DicePicker-die-result.selected');

      if ($diceForEffect.length > 0) {

        $effectDiceContainer.find('.default')?.remove();

        $diceForEffect.each(function () {
          const $die = $(this);

          const dieRating = $die.data('die-rating');
          const key = $die.data('key');

          $die
            .attr('data-type', 'effect')
            .removeClass('selected');

          $die
            .find('.cp-die')
            .toggleClass('cp-selected cp-effect');

          const dieContent = getAppendDiceContent({ dieRating, key });

          $effectDiceContainer
            .append(dieContent);
        });

        setSelectionDisable();
      }
    });

  $addToTotal
    .click(function () {
      const $diceForTotal = html.find('.DicePicker-die-result.selected');

      $diceForTotal.each(function () {
        const $die = $(this);

        const value = parseInt($die.data('value'), 10);

        $die
          .attr('data-type', 'chosen')
          .removeClass('selected');
        
        $die
          .find('.cp-die')
          .toggleClass('cp-chosen cp-selected');

        const $totalValue = html.find('.DicePicker-total-value');

        const currentValue = parseInt($totalValue.text(), 10);
        
        $totalValue.text(value + currentValue);
      });

      setSelectionDisable();
    });

  $closeButton
    .click((event) => {
      event.preventDefault();

      const values = { dice: [], total: 0, effectDice: [] };

      $dieResults
        .each(function () {
          const $die = $(this);
          const dieRating = $die.data('die-rating');
          const resultGroupIndex = parseInt($die.data('result-group-index'), 10);
          const type = $die.data('type');
          const value = parseInt($die.data('value'), 10);

          const groupValues = values.dice[resultGroupIndex] ?? [];

          values.dice[resultGroupIndex] = [
            ...groupValues,
            {
              dieRating,
              type: type === 'hitch' ? 'hitch' : 'unchosen',
              value,
            }
          ];
        });

      resolve(values);
    });

  $resetSelection
    .click(function () {
      $dieResults
        .not('[data-type="hitch"]')
        .each(function () {
          const $target = $(this);

          $target.removeClass('selected');
          $target.attr('data-type', 'unchosen');

          $target
            .find('.cp-die')
            .removeClass('cp-chosen cp-effect cp-selected')
            .addClass('cp-unchosen');
        });

      html
        .find('.DicePicker-total-value')
        .text(0);

        const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4' });

        $effectDiceContainer
          .html(dieContent);

      setSelectionOptionsDisableTo(true);
      $(this).prop('disabled', true);
    });

  $effectDiceContainer.on('mouseup', '.die-wrapper', function (event) {
    if (event.button === 2) {
      const $effectDie = $(this);

      const key = $effectDie.data('key');

      const $selectedDie = $resultGroups.find(`[data-key="${key}"]`);

      deselectEffectDie($effectDie, $selectedDie);
    }
  });

  $resultGroups.on('click', '[data-type="chosen"]', function () {
    const $selectedDie = $(this);

    const value = parseInt($selectedDie.data('value'), 10);

    $selectedDie
      .attr('data-type', 'unchosen');
    
    $selectedDie
      .find('.cp-die')
      .toggleClass('cp-chosen cp-unchosen');

    const $totalValue = html.find('.DicePicker-total-value');

    const currentValue = parseInt($totalValue.text(), 10);

    $totalValue.text(currentValue - value);

    setSelectionDisable();
  });

  $resultGroups.on('click', '[data-type="effect"]', function () {
    const $selectedDie = $(this);

    const key = $selectedDie.data('key');

    const $effectDie = $effectDiceContainer.find(`[data-key="${key}"]`);

    deselectEffectDie($effectDie, $selectedDie);
  });

  $resultGroups.on('click', '[data-type="unchosen"]', function () {
    const $target = $(this);

    $target.toggleClass('selected');

    $target.find('.cp-die').toggleClass('cp-selected cp-unchosen');

    setSelectionDisable();
  });
};

const Log$2 = Logger();

const dicePicker = async rollResults => {
  Log$2('rollDice.dicePicker rollResults:', rollResults);

  const content = await renderTemplate('systems/cortexprime/system/templates/DicePicker.html', {
    rollResults
  });

  return new Promise((resolve, reject) => {
    new Dialog({
      title: localizer('CP.SelectYourDice'),
      content,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: localizer('CP.Confirm'),
          callback (html) {
            const $dieResults = html.find('.DicePicker-die-result');

            const values = { dice: [], total: null, effectDice: [] };

            $dieResults
              .each(function () {
                const $die = $(this);
                
                const dieRating = $die.data('die-rating');
                const resultGroupIndex = parseInt($die.data('result-group-index'), 10);
                const type = $die.data('type');
                const value = parseInt($die.data('value'), 10);

                if (type === 'chosen') {
                  values.total = values.total ? values.total + value : value;
                } else if (type === 'effect') {
                  values.effectDice.push(dieRating);
                }

                const groupValues = values.dice[resultGroupIndex] ?? [];

                values.dice[resultGroupIndex] = [
                  ...groupValues,
                  {
                    dieRating,
                    type,
                    value,
                  }
                ];
              });

            resolve(values);
          }
        }
      },
      default: 'confirm',
      render: dicePickerRender(resolve),
    }, { jQuery: true, classes: ['dialog', 'DicePicker', 'cortexprime'] }).render(true);
  })
};

const display3dDice = ({ rollMode, throws }) => {
  if (game.dice3d) {
    const synchronize = rollMode !== 'selfroll';
    const whisper = ['gmroll', 'blindroll'].includes(rollMode)
      ? game.users.filter(u => u.isGM).map(u => u.id)
      : null;
    const blind = rollMode === 'blindroll';

    game.dice3d.show({ throws }, game.user, synchronize, whisper, blind);
  }
};

const getRollFormulas = (pool) => {
  return pool
    .reduce((formulas, source) => {
      return source.traits.reduce((acc, trait) => {
        if (trait.rollsSeparately) {
          return [
            ...formulas,
            {
              name: trait.name,
              formula: `d${trait.dice.join('+d')}`,
              hasHitches: trait.hasHitches,
              rollsSeparately: true,
            }
          ]
        }

        acc[0].formula = `${acc[0].formula ? (acc[0].formula + '+') : ''}d` +
          trait.dice.join('+d');

        return acc
      }, formulas)
    }, [{ name: null, formula: '', hasHitches: true, rollsSeparately: false, }])
    .filter(({ formula }) => !!formula)
};

const getRollResults = async pool => {
  const rollFormulas = getRollFormulas(pool);

  Log$2('rollDice.getRollResults rollFormulas', rollFormulas);

  const results = await rollByFormulas(rollFormulas);

  const throws = getThrows(results);

  return {
    results,
    throws
  }
};

const getSelectedDice = results => {
  return results
    .reduce(({ effectDice, total }, resultGroup) => {
      const targetEffectDie = resultGroup.rollsSeparately
        ? null
        : resultGroup.results.find(result => result.type === 'effect');
      return {
        effectDice: targetEffectDie?.dieRating ? [...effectDice, targetEffectDie.dieRating] : effectDice,
        total: total + resultGroup.results.reduce((totalValue, result) => result.type === 'chosen' ? totalValue + result.value : totalValue, 0)
      }
    }, { effectDice: [], total: 0 })
};

const getThrows = (results) => {
  return results.reduce((acc, result) => {
    return [
      ...acc,
      {
        dice: result.roll.dice.map(die => ({
          options: {},
          result: die.total,
          resultLabel: die.total,
          type: `d${die.faces}`,
          vectors: [],
        }))
      }
    ]
  }, [])
};

const initDiceValues = ({ roll, rollFormula }) => {
  return roll.dice.map(die => ({
    dieRating: die.faces,
    type: die.total > 1 || !rollFormula.hasHitches ? 'unchosen' : 'hitch',
    value: die.total
  }))
};

const markResultEffect = results => {
  if (results.rollsSeparately) return results

  results.results = sortResultsByDieRating(results.results);

  results.results = results.results.reduce((acc, result) => {
    const hasEffectDie = acc.some(item => item.type === 'effect');
    if (!['chosen', 'hitch'].includes(result.type) && !hasEffectDie) return [...acc, { ...result, type: 'effect' }]

    return [...acc, result]
  }, []);

  return results
};

const markResultTotals = results => {
  const selectedTotalCount = results.rollsSeparately ? 1 : 2;

  results.results = sortResultsByValue(results.results);

  results.results = results.results.reduce((acc, result) => {
    if (!['effect', 'hitch'].includes(result.type) && acc.count < selectedTotalCount) {
      return { dice: [...acc.dice, { ...result, type: 'chosen' }], count: acc.count + 1 }
    }

    return { dice: [...acc.dice, result], count: acc.count }
  }, { dice: [], count: 0 }).dice;

  return results
};

const renderRollResult = async ({ diceSelections, effectDice, pool, results, rollMode, total }) => {
  const contentData = {
    effectDice,
    pool,
    resultGroups: results.map((resultGroup, resultGroupIndex) => {
      resultGroup.diceSelection = diceSelections[resultGroupIndex];
      return resultGroup
    }),
    speaker: game.user,
    total: total ?? 0
  };

  Log$2('rollDice.renderRollResult contentData:', contentData);

  const content = await renderTemplate('systems/cortexprime/system/templates/RollResult.html', contentData);

  const chatData = ChatMessage.applyRollMode({ content }, rollMode);

  ChatMessage.create(chatData);
};

const rollByFormulas = async (rollFormulas) => {
  return Promise.all(rollFormulas.map(async (rollFormula) => {
    const r = new Roll(rollFormula.formula);
    
    const roll = await r.evaluate({ async: true });

    const results = initDiceValues({ roll, rollFormula });

    const sortedResults = sortResultsByValue(results);

    return {
      ...rollFormula,
      results: sortedResults,
      roll
    }
  }))
};

const rollForEffect = results => {
  const effectMarkedResults = results.map(x => markResultEffect(x));
  const finalResults = effectMarkedResults.map(x => markResultTotals(x));

  const {
    effectDice,
    total
  } = getSelectedDice(finalResults);
  
  Log$2('rollDice.rollForEffect finalResults, effectDice, total:', finalResults, effectDice, total);

  return {
    dice: finalResults.map(x => x.results),
    effectDice,
    total
  }
};

const rollForTotal = results => {
  const totalMarkedResults = results.map(x => markResultTotals(x));
  const finalResults = totalMarkedResults.map(x => {
    const markedResults = markResultEffect(x);
    markedResults.results = sortResultsByValue(markedResults.results);
    
    return markedResults
  });

  const {
    effectDice,
    total
  } = getSelectedDice(finalResults);

  Log$2('rollDice.rollForTotal finalResults, effectDice, total:', finalResults, effectDice, total);

  return {
    dice: finalResults.map(x => x.results),
    effectDice,
    total
  }
};

const selectByType = async ({ results, rollType }) => {
  return rollType === 'select'
    ? await dicePicker(results)
    : rollType === 'total'
      ? rollForTotal(results)
      : rollForEffect(results)
};

const sortResultsByDieRating = results => {
  const r = [...results];
  
  r.sort((a, b) => {
    if (a.dieRating !== b.dieRating) {
      return b.dieRating - a.dieRating
    }

    return b.value - a.value
  });

  return r
};

const sortResultsByValue = results => {
  const r = [...results];
  
  r.sort((a, b) => {
    if (a.value !== b.value) {
      return b.value - a.value
    }

    return b.dieRating - a.dieRating
  });

  return r
};

async function rollDice (pool, rollType, rollMode) {
  const { results, throws } = await getRollResults(pool);

  Log$2('rollDice.default rollMode, rollType, results, throws', rollMode, rollType, results, throws);

  await this?.clear();
  this?.close();

  const {
    dice: diceSelections,
    effectDice,
    total,
  } = await selectByType({ results, rollType });

  Log$2('rollDice.default diceSelections:', diceSelections);

  display3dDice({ rollMode, throws });

  await renderRollResult({
    diceSelections,
    effectDice,
    pool,
    results,
    rollMode,
    total,
  });
}

const Log$1 = Logger();

const getBlankCustomAdd = () => ({
  dice: [8],
  hasHitches: true,
  parentName: null,
  name: '',
  rollsSeparately: false,
});

class DicePool extends FormApplication {
  constructor () {
    super();

    this.customAdd = getBlankCustomAdd();

    this.pool = [];
    this.rollMode = game.settings.get('core', 'rollMode');
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'DicePool'],
      closeOnSubmit: false,
      height: 'auto',
      id: 'DicePool',
      left: 20,
      resizable: false,
      submitOnClose: true,
      submitOnChange: true,
      template: 'systems/cortexprime/system/templates/DicePool.html',
      title: localizer('CP.DicePool'),
      top: 500,
      width: 480
    })
  }

  getData () {
    const data = {
      customAdd: this.customAdd,
      pool: this.pool,
      poolIsEmpty: this.poolIsEmpty,
      rollMode: this.rollMode,
      rollModes: [
          { name: localizer('CP.PublicRoll'), value: 'publicroll' },
          { name: localizer('CP.PrivateGmRoll'), value: 'gmroll' },
          { name: localizer('CP.BlindGmRoll'), value: 'blindroll' },
          { name: localizer('CP.SelfRoll'), value: 'selfroll' },
      ],
    };

    Log$1('DicePool.getData data:', data);

    return data
  }

  _updateObject (event, formData) {
    const expandedData = expandObject(formData);

    this.customAdd = {
      ...this.customAdd,
      ...expandedData.customAdd,
    };

    this.rollMode = expandedData.rollMode;

    Log$1(
      'DicePool._updateObject event, expandedData, this.rollMode:',
      event,
      expandedData,
      this.rollMode,
    );
  }

  activateListeners (html) {
    super.activateListeners(html);
    fieldListeners.call(this, html);
    diceSelectListener(
      html,
      this.onAddDie.bind(this),
      this.onChangeDie.bind(this),
      this.onRemoveDie.bind(this),
    );

    html
      .find('#DicePool-add-custom-trait')
      .click(this.addCustomTrait.bind(this));
    
    html
      .find('#DicePool-clear')
      .click(() => {
        this.clear();
        this.render(true);
      });
    
    html
      .find('.DicePool-remove-trait')
      .click(this.removeTrait.bind(this));
    
    html
      .find('#DicePool-reset-custom-trait')
      .click(this.resetCustomTrait.bind(this));
    
    html
      .find('#DicePool-roll-effect')
      .click(() => this._rollDice.call(this, 'effect'));
    
    html
      .find('#DicePool-roll-select')
      .click(() => this._rollDice.call(this, 'select'));
    
    html
      .find('#DicePool-roll-total')
      .click(() => this._rollDice.call(this, 'total'));

    html
      .find('#DicePool-rolls-separately')
      .change(event => this._onRollsSeparatelyChange.call(this, event, html));
  }

  get poolIsEmpty() {
    return this.pool
      .reduce((isEmpty, sourceGroup) => {
        if (!isEmpty) return false
        return !((sourceGroup?.traits?.length ?? 0) > 0)
      }, true)
  }

  _getTargetTrait(event) {
    const trait = event.currentTarget.closest('.DicePool-trait');

    const {
      sourceIndex,
      traitIndex
    } = trait.dataset;

    return this.pool[sourceIndex].traits[traitIndex]
  }

  _getTraitByTarget(event, target) {
    return target === 'customAdd'
      ? this.customAdd
      : target === 'trait'
        ? this._getTargetTrait(event)
        : null
  }

  async _rollDice (rollType) {
    event.preventDefault();

    Log$1('DicePool._rollDice this.pool, rollType:', this.pool, rollType);

    await rollDice.call(this, this.pool, rollType, this.rollMode);
  }

  _onRollsSeparatelyChange (event, html) {
    const $target = $(event.currentTarget);
    const isRolledSeparately = $target.prop('checked');

    const $hasHitchesCheckbox = html
    .find('#DicePool-has-hitches');

    $hasHitchesCheckbox
      .prop('disabled', !isRolledSeparately)
      .prop('checked', !isRolledSeparately);

    $hasHitchesCheckbox
      .closest('.field-checkbox')
      .toggleClass('field-disabled');
  }

  async addCustomTrait (event) {
    event.preventDefault();

    const matchingSourceIndex = this.pool
      .findIndex(sourceGroup => sourceGroup.source === 'Custom');

    if (matchingSourceIndex < 0) {
      this.pool = [...this.pool, {
        source: 'Custom',
        traits: [this.customAdd]
      }];
    } else {
      this.pool[matchingSourceIndex].traits = [
        ...this.pool[matchingSourceIndex].traits,
        this.customAdd,
      ];
    }

    this.resetCustomTrait();
  }

  addToPool (event) {
    const $addToPoolButton = $(event.currentTarget);
    const $rollResult = $addToPoolButton.closest('.RollResult');

    this.pool = Array.from($rollResult.find('.RollResult-source'))
      .map(sourceGroup => ({
        source: sourceGroup.dataset.source ?? null,
        traits: Array.from($(sourceGroup).find('.RollResult-trait'))
          .map(trait => ({
            dice: Array.from($(trait).find('.cp-die .number'))
              .map(number => parseInt(number.innerText, 10)),
            hasHitches: trait.dataset.hasHitches ?? false,
            name: trait.dataset.name ?? null,
            parentName: trait.dataset.parentName ?? null,
            rollsSeparately: trait.dataset.rollsSeparately !== 'false'
          }))
      }));
  }

  clear () {
    this.customAdd = getBlankCustomAdd();

    this.pool = [];
  }

  async onAddDie (event, { target }) {
    const targetTrait = this._getTraitByTarget(event, target);

    targetTrait.dice = [
      ...targetTrait.dice,
      targetTrait.dice[targetTrait.dice.length - 1] ?? 8
    ];

    await this.render(true);
  }

  async onChangeDie (event, { index, target, value }) {
    const targetTrait = this._getTraitByTarget(event, target);

    targetTrait.dice = targetTrait.dice.map((die, dieIndex) => {
      return dieIndex === index ? value : die
    });

    await this.render(true);
  }

  async onRemoveDie (event, { index, target }) {
    const targetTrait = this._getTraitByTarget(event, target);

    targetTrait.dice = targetTrait.dice
      .filter((die, dieIndex) => dieIndex !== index);

    await this.render(true);
  }

  async removeTrait (event) {
    const trait = event.currentTarget.closest('.DicePool-trait');

    const {
      sourceIndex,
      traitIndex
    } = trait.dataset;

    this.pool[sourceIndex].traits = this.pool[sourceIndex].traits
      .filter((trait, index) => index !== parseInt(traitIndex, 10));

    await this.render(true);
  }

  async resetCustomTrait(event) {
    if (event) event.preventDefault();

    this.customAdd = getBlankCustomAdd();

    await this.render(true);
  }

  async toggle () {
    if (!this.rendered) {
      await this.render(true);
    } else {
      this.close();
    }
  }
}

var ready = async () => {
  game.cortexprime.DicePool = new DicePool();
};

var renderChatLog = (log, html, data) => {
  const $chatLog = html.find('#chat-log');
  
  $chatLog
    .on('click', '.display-toggle', displayToggleMethod)
    .on('click', '.RollResult-add-to-pool', (event) => {
      game.cortexprime.DicePool.addToPool(event);
      game.cortexprime.DicePool.render(true);
    })
    .on('click', '.RollResult-re-roll', (event) => {
      game.cortexprime.DicePool.addToPool(event);
      game.cortexprime.DicePool._rollDice('select');
      game.cortexprime.DicePool.clear();
    });
};

const getHtml = (value, options) => {
  return '<div class="die-result' +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '" ' +
    `data-die-rating="${options.hash.dieRating}" ` +
    (options.hash.key ? `data-key="${options.hash.key}" ` : '') +
    (options.hash.resultGroupIndex || options.hash.resultGroupIndex === 0 ? `data-result-group-index="${options.hash.resultGroupIndex}" ` : '') +
    `data-type="${options.hash.type}" ` +
    `data-value="${value}"` +
    '>' +
    '<div class="die-wrapper">' +
    '<div class="die-container">' +
    getDieIcon(options.hash.dieRating, options.hash.type, value) +
    '</div>' +
    '</div>' +
    (options.hash.hideLabel ? '' : `<span class="die-result-label">d${options.hash.dieRating}</span>`) +
    '</div>'
};

var dieResult = (value, options) => {
  return new Handlebars.SafeString(getHtml(value, options))
};

var renderChatMessage = (message, html, data) => {
  const $rollResult = html.find('.RollResult-main').first();

  if ($rollResult) {
    html.addClass('cortexprime RollResult');

    $rollResult
      .find('.chat-die')
      .each(function () {
        const $die = $(this);

        const data = $die.data();

        const { dieRating, hideLabel, resultGroupIndex, type, value } = data;

        const html = getHtml(value, {
          hash: {
            class: 'RollResult-die-result',
            dieRating,
            hideLabel: !!hideLabel,
            resultGroupIndex,
            type
          }
        });

        $die.replaceWith(html);
      });
  }
};

var renderSceneControls = (controls, html) => {
  const $dicePoolButton = $(
    `<li class="dice-pool-control" data-control="dice-pool" title="${game.i18n.localize("DicePool")}">
      <i class="fas fa-dice"></i>
      <ol class="control-tools">
      </ol>
    </li>`
  );

  html
    .find('.main-controls')
    .append($dicePoolButton);

  html
    .find('.dice-pool-control')
    .removeClass('control-tool')
    .on('click', async () => {
      await game.cortexprime.DicePool.toggle();
    });
};

var hooks = () => {
  Hooks.on('ready', ready);
  Hooks.on('renderChatLog', renderChatLog);
  Hooks.on('renderChatMessage', renderChatMessage);
  Hooks.on('renderSceneControls', renderSceneControls);
};

const getAddButton = (options) => {
  return '<button class="new-die btn btn-icon btn-icon-text btn-small ml-1" ' +
    (options.hash.target ? `data-target="${options.hash.target}" ` : '') +
    'type="button">' +
    '<i class="fa fa-plus"></i>' +
    '</button>'
};

const getSelect = (options, { dieIndex, dieRating }) => {
  return '<select ' +
    'class="die-select" ' +
    `data-index="${dieIndex}"` +
    (options.hash.target ? `data-target="${options.hash.target}" ` : '') +
    '>' +
    [4, 6, 8, 10, 12].reduce((selectOptions, rating) => {
      if (rating >= (options.hash.min ?? 4) && rating <= (options.hash.max ?? 12)) {
        return selectOptions +
        `<option value="${rating}"` +
        (dieRating === rating ? ' selected>' : '>') +
        `d${rating}` +
        '</option>'
      }

      return selectOptions
    }, '') +
    '</select>'
};

var diceSelect = (val, options) => {
  const type = options.hash.type ?? 'die-rating';
  const value = val
    ? val
    : options.hash.defaultDie
      ? [options.hash.defaultDie]
      : [];
  return new Handlebars.SafeString(
    '<div class="dice-' +
    (options.hash.displayOnly ? 'display' : 'select') +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? `<label class="field-label">${options.hash.label}</label>` : '') +
    '<div class="dice-wrapper flex gap-0">' +
    '<div class="dice-container flex flex-wrap gap-0">' +
    value.reduce((diceString, dieRating, dieIndex) => {
      return diceString +
      '<div class="die-wrapper' +
      (options.hash.dieWrapperClass ? ` ${options.hash.dieWrapperClass}` : '') +
      '">' +
      '<div class="die-container">' +
      getDieIcon(dieRating, type) +
      '</div>' +
      (options.hash.displayOnly ? '' : getSelect(options, { dieIndex, dieRating })) +
      '</div>'
    }, '') +
    '</div>' +
    (options.hash.displayOnly ? '' : getAddButton(options)) +
    '</div>' +
    '</div>'
  )
};

var fieldCheckbox = (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass'
  ];

  return new Handlebars.SafeString(
    '<div class="field field-checkbox' +
    (options.hash.disabled === true ? ' field-disabled' : '') +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? '<label' : '<div') +
    ' class="field-wrapper flex gap-1' +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">'+
    `<input type="checkbox" ` +
    (value ? 'checked ' : '') +
    Object.entries(options.hash)
      .reduce((attributes, [key, value]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required'].includes(key) && value === true) {
          return [...attributes, key]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-checkbox-input ${value}"`;
          return attributes
        }

        const val = value ?? null;

        return [...attributes, val || val === 0 ? `${key}="${value}"` : '']
      }, ['class="field-checkbox-input"'])
      .join(' ') +
    `>` +
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
};

var fieldInput = (type) => (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass'
  ];

  return new Handlebars.SafeString(
    `<div class="field field-${type}` +
    (options.hash.disabled === true ? ' field-disabled' : '') +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? '<label' : '<div') +
    ' class="field-wrapper' +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">'+
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    `<input type="${type}" ` +
    Object.entries(options.hash)
      .reduce((attributes, [key, value]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required'].includes(key) && value === true) {
          return [...attributes, key]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-input ${value}"`;
          return attributes
        }

        const val = value ?? null;

        return [...attributes, val || val === 0 ? `${key}="${value}"` : '']
      }, ['class="field-input"'])
      .join(' ') +
    ` value="${value ?? ''}"` +
    `>` +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
};

var fieldSelect = (value, items, name, val, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass'
  ];

  return new Handlebars.SafeString(
    '<div class="field field-select' +
    (options.hash.disabled === true ? ' field-disabled' : '') +
    (options.hash.class ? ` ${options.hash.class}` : '') +
    '">' +
    (options.hash.label ? '<label' : '<div') +
    ` class="field-wrapper` +
    (options.hash.wrapperClass ? ` ${options.hash.wrapperClass}` : '') +
    '">' +
    (options.hash.label ? `<span class="field-label` : '') +
    (options.hash.label && options.hash.labelClass ? ' ' + options.hash.labelClass : '') +
    (options.hash.label ? `">${options.hash.label}</span>` : '') +
    `<select ` +
    Object.entries(options.hash)
      .reduce((attributes, [key, value]) => {
        if (inputHashIgnore.includes(key)) return attributes

        if (['disabled', 'required'].includes(key) && value === true) {
          return [...attributes, key]
        }

        if (key === 'inputClass') {
          attributes[0] = `class="field-input ${value}"`;
          return attributes
        }

        const val = value ?? null;

        return [...attributes, val || val === 0 ? `${key}="${value}"` : '']
      }, ['class="field-input"'])
      .join(' ') +
    `>` +
    items
      .map(item => {
        return `<option value="${item[val]}"` +
        (item[val] === value ? ' selected>' : '>') +
        `${item[name]}</option>`
      })
      .join('') +
    `</select>` +
    (options.hash.label ? `</label>` : '</div>') +
    (options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : '') +
    '</div>'
  )
};

const registerHandlebarHelpers = () => {
  Handlebars.registerHelper({
    add: (a, b) => +a + +b,
    get: (list, key) => list[key] ?? false,
    length: (value) => value?.length ?? null,
    sub: (a, b) => +a - +b,
    tern: (a, b, c) => a ? b : c,
  }),
  Handlebars.registerHelper('times', (n, block) => {
    let accum = '';
    for(let i = 0; i < n; ++i)
      accum += block.fn(i);
    return accum
  });
  Handlebars.registerHelper('diceSelect', diceSelect);
  Handlebars.registerHelper('dieResult', dieResult);
  Handlebars.registerHelper('fieldNumber', fieldInput('number'));
  Handlebars.registerHelper('fieldCheckbox', fieldCheckbox);
  Handlebars.registerHelper('fieldSelect', fieldSelect);
  Handlebars.registerHelper('fieldText', fieldInput('text'));
};

const Log = Logger();

Hooks.once('init', () => {
  CONFIG.debug.logs = true;

  game.cortexprime = {};

  Log('Initializing Cortex prime system...');

  registerHandlebarHelpers();
  hooks();
});
//# sourceMappingURL=cortexprime.mjs.map
