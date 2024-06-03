var Logger = method => (...args) => {
  if (CONFIG.debug?.logs) {
    if (!method || typeof method === 'string') console[method || 'log'](...args);
    else args.forEach((arg, index) => {
      console[method?.[index] ?? 'log'](arg);
    });
  }
};

const Assert = Logger('assert');
const Log$8 = Logger();

class CpItem extends Item {
  async _preCreate(data, options, user) {
    Log$8('CpItem._preCreate data, options, user', data, options, user);

    const itemTypeSettings = game.settings.get('cortexprime', 'itemTypes');

    Log$8('CpItem._preCreate itemTypeSettings', itemTypeSettings);

    const traitTypes = itemTypeSettings.traits
      .map(({ id, name }) => ({ id, name }));

    const subtraitTypes = itemTypeSettings.subtraits
      .map(({ id, name }) => ({ id, name }));

    if (data.type === 'Trait') {
      Assert(
        traitTypes?.length > 0,
        'CpItem._preCreate: There are no trait type options'
      );
    }

    if (data.type === 'Subtrait') {
      Assert(
        subtraitTypes?.length > 0,
        'CpItem._preCreate: There are no subtrait type options'
      );
    }

    const itemTypes = data.type === 'Trait'
      ? traitTypes
      : data.type === 'Subtrait'
        ? subtraitTypes
        : [];

    if (itemTypes.length !== 1) return

    await this.updateSource({
      'system.itemType': itemTypes[0],
    });
  }
}

const addListeners = ($html, selector, event, callback) => {
  $html
    .querySelectorAll(selector)
    .forEach($item => {
      $item.addEventListener(event, callback);
    });
};

const camelCasetoKebabCase = str => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
      ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
      : letter
  }).join('')
};

const displayToggleMethod = function(event, $target) {
  const $toggler = $target ?? event.currentTarget;

  const $chevronIcon = $toggler.querySelector('.toggler-icon');

  const { parent, target } = $toggler.dataset;

  $chevronIcon
    .classList
    .toggle('fa-chevron-down');

  $chevronIcon
    .classList
    .toggle('fa-chevron-up');

  $toggler
    .closest(parent)
    ?.querySelector(target)
    ?.classList
    ?.toggle('hide');
};

const displayToggle = $html => {
  addListeners(
    $html,
    '.display-toggle',
    'click',
    displayToggleMethod
  );
};

const checkboxDisplayToggle = $html => {
  addListeners(
    $html,
    '.checkbox-display-toggle',
    'change',
    event => {
      const $toggler = event.currentTarget;

      const {
        parent,
        target,
      } = $toggler.dataset;

      $toggler
        .closest(parent)
        ?.querySelector(target)
        ?.classList
        ?.toggle('hide');
    }
  );
};

const localizer = target => game.i18n.localize(target);

const objectSortToArray = (obj, cb) => {
  const entries = Object.entries(obj);

  const callback = cb
    ? cb
    : ([a], [b]) => b > a ? -1 : a > b ? 1 : 0;

  entries.sort((a, b) => callback(a, b, entries.length));

  return entries
    .map(([_, value]) => value)
};

const rounding = (dir = null) => (number, increment, offset) => {
  const roundingDir = dir ?? 'round';
  if (!increment) return number

  const incSplit = increment.toString().split('.');

  const precision = incSplit.length > 1 ? incSplit[1].length : null;
  const value = (Math[roundingDir]((number - offset) / increment ) * increment) + offset;

  return precision ? parseFloat(value.toPrecision(precision)) : value
};

const round = rounding();

const uuid = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => {
    return (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)
  })
};

const diceSelectListener = ($html, { addDie, changeDie, removeDie }) => {

  if (addDie) {
    addListeners(
      $html,
      '.new-die',
      'click',
      event => {
        const { target } = event.currentTarget.dataset ?? {};
        addDie(event, { target });
      }
    );
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
        } = event.currentTarget.dataset ?? {};

        changeDie(event, {
          index: parseInt(index, 10),
          target,
          value: parseInt(event.currentTarget.value, 10),
        });
      }
    );
  }

  if (removeDie) {
    addListeners(
      $html,
      '.die-select.removable',
      'mouseup',
      event => {
        event.preventDefault();

        const {
          index,
          target,
        } = event.currentTarget.dataset ?? {};

        if (event.button === 2) removeDie(event, {
          index: parseInt(index, 10),
          target,
        });
      }
    );
  }
};

const numberFieldListener = $html => {
  $html
    .querySelectorAll('.field-number .field-input')
    .forEach($numberInput => {
      $numberInput
        .addEventListener('change', event => {
          const el = event.target;

          if (!el.required && !el.value && el.value !== 0) return

          const max = el.max || el.max === 0 ? Number(el.max) : null;
          const min = el.min || el.min === 0 ? Number(el.min) : null;
          const step = Number(el.step);
          const value = Number(el.value);

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
    });
};

const fieldListeners = html => {
  numberFieldListener(html);
};

const diceIcons = {
  d4: (type = 'die-rating', number = 4) => (
    `<div class="cp-die cp-d4 cp-${type}">`
    + '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d4">'
    + '<path class="fill" d="M15 30 30 4H0l15 26z"></path>'
    + '<path class="stroke" d="M26.54 6 15 26 3.46 6h23.08M30 4H0l15 26L30 4z"></path>'
    + '</svg>'
    + `<div class="number">${number}</div>`
    + '</div>'),
  d6: (type = 'die-rating', number = 6) => (
    `<div class="cp-die cp-d6 cp-${type}">`
    + '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d6">'
    + '<path class="fill" d="M4 4h22v22H4V4z"></path>'
    + '<path class="stroke" d="M24 6v18H6V6h18m2-2H4v22h22V4z"></path>'
    + '</svg>'
    + `<div class="number">${number}</div>`
    + '</div>'
  ),
  d8: (type = 'die-rating', number = 8) => (
    `<div class="cp-die cp-d8 cp-${type}">`
    + '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d8">'
    + '<path class="fill" d="M1 15 15 1l14 14-14 14L1 15z"></path>'
    + '<path class="stroke" d="M15 3.83 26.17 15 15 26.17 3.83 15 15 3.83M15 1 1 15l14 14 14-14L15 1z"></path>'
    + '</svg>'
    + `<div class="number">${number}</div>`
    + '</div>'
  ),
  d10: (type = 'die-rating', number = 10) => (
    `<div class="cp-die cp-d10 cp-${type}">`
    + '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d10">'
    + '<path class="fill" d="M3 8.07v13.86L15 28l12-6.07V8.07L15 2 3 8.07z"></path>'
    + '<path class="stroke" d="M15 2 3 8.07v13.86L15 28l12-6.07V8.07L15 2zm10 18.7-10 5.06L5 20.7V9.3l10-5.06L25 9.3v11.4z"></path>'
    + '</svg>'
    + `<div class="number">${number}</div>`
    + '</div>'
  ),
  d12: (type = 'die-rating', number = 12) => (
    `<div class="cp-die cp-d12 cp-${type}">`
    + '<svg viewBox="0 0 30 30" aria-hidden="false" aria-label="d12">'
    + '<path class="fill" d="M27 18.9v-7.8l-4.58-6.31L15 2.38 7.58 4.79 3 11.1v7.8l4.58 6.31L15 27.62l7.42-2.41L27 18.9z"></path>'
    + '<path class="stroke" d="m15 4.48 6.18 2.01L25 11.75v6.5l-3.82 5.26L15 25.52l-6.18-2.01L5 18.25v-6.5l3.82-5.26L15 4.48m0-2.1L7.58 4.79 3 11.1v7.8l4.58 6.31L15 27.62l7.42-2.41L27 18.9v-7.8l-4.58-6.31L15 2.38z"></path>'
    + '</svg>'
    + `<div class="number">${number}</div>`
    + '</div>'
  ),
};

const getDieIcon = (rating, type, number) => {
  return diceIcons[`d${rating}`](type, number)
};

const getAppendDiceContent = ({ isDefault, dieRating, key }) => {
  return `<div class="die-wrapper${
    isDefault ? ' default' : ''
  }"${
    key ? ` data-key="${key}"` : ''
  }>`
    + `<div class="dice-container">${
      getDieIcon(dieRating, 'effect')
    }</div>`
    + '</div>'
};

var dicePickerRender = resolve => ([$html]) => {
  const $addToTotal = $html.querySelector('.DicePicker-add-to-total');
  const $addToEffect = $html.querySelector('.DicePicker-add-to-effect');
  const $effectDiceContainer = $html.querySelector('.DicePicker-effect-value .dice-container');
  const $resetSelection = $html.querySelector('.DicePicker-reset');

  const setSelectionOptionsDisableTo = value => {
    $addToTotal.disabled = value ?? !$addToTotal.disabled;
    $addToEffect.disabled = value ?? !$addToEffect.disabled;
  };

  const setSelectionDisable = () => {
    const $selectedDice = $html.querySelectorAll('.DicePicker-die-result.selected');
    const $usedDice = $html.querySelectorAll('.DicePicker-die-result[data-type="effect"], .DicePicker-die-result[data-type="chosen"]');

    setSelectionOptionsDisableTo(!($selectedDice.length > 0));

    $resetSelection.disabled = !($selectedDice.length > 0 || $usedDice.length > 0);
  };

  const deselectEffectDie = ($effectDie, $selectedDie) => {
    $selectedDie.dataset.type = 'unchosen';

    const $selectedCpDie = $selectedDie.querySelector('.cp-die');

    $selectedCpDie.classList.toggle('cp-unchosen');
    $selectedCpDie.classList.toggle('cp-effect');

    $effectDie.remove();

    const $effectDice = $effectDiceContainer.querySelectorAll('.die-wrapper');

    if ($effectDice.length === 0) {
      const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4' });

      $effectDiceContainer
        .insertAdjacentHTML('beforeend', dieContent);
    }

    setSelectionDisable();
  };

  $addToEffect
    .addEventListener('click', () => {
      const $diceForEffect = $html.querySelectorAll('.DicePicker-die-result.selected');

      if ($diceForEffect.length > 0) {
        $effectDiceContainer.querySelector('.default')?.remove();

        $diceForEffect.forEach($die => {
          const $cpDie = $die.querySelector('.cp-die');
          const dieRating = $die.dataset.dieRating;
          const key = $die.dataset.key;

          $die.dataset.type = 'effect';
          $die.classList.remove('selected');

          $cpDie.classList.toggle('cp-selected');
          $cpDie.classList.toggle('cp-effect');

          const dieContent = getAppendDiceContent({ dieRating, key });

          $effectDiceContainer
            .insertAdjacentHTML('beforeend', dieContent);
        });

        setSelectionDisable();
      }
    });

  $addToTotal
    .addEventListener('click', () => {
      const $diceForTotal = $html.querySelectorAll('.DicePicker-die-result.selected');

      $diceForTotal.forEach($die => {
        const $cpDie = $die.querySelector('.cp-die');
        const value = parseInt($die.dataset.value, 10);

        $die.dataset.type = 'chosen';
        $die.classList.remove('selected');

        $cpDie.classList.toggle('cp-chosen');
        $cpDie.classList.toggle('cp-selected');

        const $totalValue = $html.querySelector('.DicePicker-total-value');

        const currentValue = parseInt($totalValue.textContent, 10);

        $totalValue.textContent = value + currentValue;
      });

      setSelectionDisable();
    });

  $html
    .closest('.window-app.dialog')
    .querySelector('.header-button.close')
    .addEventListener('click', event => {
      event.preventDefault();

      const values = { dice: [], total: 0, effectDice: [] };

      $html
        .querySelectorAll('.DicePicker-die-result')
        .forEach($die => {
          const dieRating = $die.dataset.dieRating;
          const resultGroupIndex = parseInt($die.dataset.resultGroupIndex, 10);
          const type = $die.dataset.type;
          const value = parseInt($die.dataset.value, 10);

          const groupValues = values.dice[resultGroupIndex] ?? [];

          values.dice[resultGroupIndex] = [
            ...groupValues,
            {
              dieRating,
              type: type === 'hitch' ? 'hitch' : 'unchosen',
              value,
            },
          ];
        });

      resolve(values);
    });

  $resetSelection
    .addEventListener('click', $selection => {
      $html
        .querySelectorAll('.DicePicker-die-result:not([data-type="hitch"])')
        .forEach($target => {
          $target.classList.remove('selected');
          $target.dataset.type = 'unchosen';

          const $cpDie = $target.querySelector('.cp-die');

          $cpDie.classList.remove('cp-chosen', 'cp-effect', 'cp-selected');
          $cpDie.classList.add('cp-unchosen');
        });

      $html
        .querySelector('.DicePicker-total-value')
        .textContent = '0';

      const dieContent = getAppendDiceContent({ isDefault: true, dieRating: '4' });

      $effectDiceContainer.innerHtml = dieContent;

      setSelectionOptionsDisableTo(true);
      $selection.disabled = true;
    });

  $effectDiceContainer
    .addEventListener('mouseup', event => {
      const $effectDie = event.target.closest('.die-wrapper');

      if ($effectDie && event.button === 2) {
        const key = $effectDie.dataset.key;

        const $selectedDie = $html
          .querySelector(`.DicePicker-result-groups [data-key="${key}"]`);

        deselectEffectDie($effectDie, $selectedDie);
      }
    });

  addListeners(
    $html,
    '.DicePicker-result-groups',
    'click',
    event => {
      const $chosenDie = event.target.closest('[data-type="chosen"]');
      const $effectDie = event.target.closest('[data-type="effect"]');
      const $unchosenDie = event.target.closest('[data-type="unchosen"]');

      if ($chosenDie) {
        const value = parseInt($chosenDie.dataset.value, 10);

        $chosenDie.dataset.type = 'unchosen';

        const $cpDie = $chosenDie.querySelector('.cp-die');

        $cpDie.classList.toggle('cp-chosen');
        $cpDie.classList.toggle('cp-unchosen');

        const $totalValue = $html.querySelector('.DicePicker-total-value');

        const currentValue = parseInt($totalValue.textContent, 10);

        $totalValue.textContent = currentValue - value;

        setSelectionDisable();
      }

      if ($effectDie) {
        const key = $effectDie.dataset.key;

        const $currentEffectDie = $effectDiceContainer.querySelector(`[data-key="${key}"]`);

        deselectEffectDie($currentEffectDie, $effectDie);
      }

      if ($unchosenDie) {
        $unchosenDie.classList.toggle('selected');

        const $cpDie = $unchosenDie.querySelector('.cp-die');

        $cpDie.classList.toggle('cp-selected');
        $cpDie.classList.toggle('cp-unchosen');

        setSelectionDisable();
      }
    }
  );
};

const Log$7 = Logger();

const dicePicker = async rollResults => {
  Log$7('rollDice.dicePicker rollResults:', rollResults);

  const content = await renderTemplate('systems/cortexprime/system/templates/DicePicker.html', {
    rollResults,
  });

  return new Promise((resolve, reject) => {
    new Dialog({
      title: localizer('CP.SelectYourDice'),
      content,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: localizer('CP.Confirm'),
          callback([$html]) {
            const $dieResults = $html
              .querySelectorAll('.DicePicker-die-result');

            const values = { dice: [], total: null, effectDice: [] };

            $dieResults
              .forEach($die => {
                const dieRating = $die.dataset.dieRating;
                const resultGroupIndex = parseInt($die.dataset.resultGroupIndex, 10);
                const type = $die.dataset.type;
                const value = parseInt($die.dataset.value, 10);

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
                  },
                ];
              });

            resolve(values);
          },
        },
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

const getRollFormulas = pool => {
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
            },
          ]
        }

        acc[0].formula = `${acc[0].formula ? (`${acc[0].formula}+`) : ''}d${
          trait.dice.join('+d')}`;

        return acc
      }, formulas)
    }, [{ name: null, formula: '', hasHitches: true, rollsSeparately: false }])
    .filter(({ formula }) => !!formula)
};

const getRollResults = async pool => {
  const rollFormulas = getRollFormulas(pool);

  Log$7('rollDice.getRollResults rollFormulas', rollFormulas);

  const results = await rollByFormulas(rollFormulas);

  const throws = getThrows(results);

  return {
    results,
    throws,
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
        total: total + resultGroup.results.reduce((totalValue, result) => result.type === 'chosen' ? totalValue + result.value : totalValue, 0),
      }
    }, { effectDice: [], total: 0 })
};

const getThrows = results => {
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
        })),
      },
    ]
  }, [])
};

const initDiceValues = ({ roll, rollFormula }) => {
  return roll.dice.map(die => ({
    dieRating: die.faces,
    type: die.total > 1 || !rollFormula.hasHitches ? 'unchosen' : 'hitch',
    value: die.total,
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
    total: total ?? 0,
  };

  Log$7('rollDice.renderRollResult contentData:', contentData);

  const content = await renderTemplate('systems/cortexprime/system/templates/RollResult.html', contentData);

  const chatData = ChatMessage.applyRollMode({ content }, rollMode);

  ChatMessage.create(chatData);
};

const rollByFormulas = async rollFormulas => {
  return Promise.all(rollFormulas.map(async rollFormula => {
    const r = new Roll(rollFormula.formula);

    const roll = await r.evaluate();

    const results = initDiceValues({ roll, rollFormula });

    const sortedResults = sortResultsByValue(results);

    return {
      ...rollFormula,
      results: sortedResults,
      roll,
    }
  }))
};

const rollForEffect = results => {
  const effectMarkedResults = results.map(x => markResultEffect(x));
  const finalResults = effectMarkedResults.map(x => markResultTotals(x));

  const {
    effectDice,
    total,
  } = getSelectedDice(finalResults);

  Log$7('rollDice.rollForEffect finalResults, effectDice, total:', finalResults, effectDice, total);

  return {
    dice: finalResults.map(x => x.results),
    effectDice,
    total,
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
    total,
  } = getSelectedDice(finalResults);

  Log$7('rollDice.rollForTotal finalResults, effectDice, total:', finalResults, effectDice, total);

  return {
    dice: finalResults.map(x => x.results),
    effectDice,
    total,
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

async function rollDice(pool, rollType, rollMode) {
  const { results, throws } = await getRollResults(pool);

  Log$7('rollDice.default rollMode, rollType, results, throws', rollMode, rollType, results, throws);

  await this?.clear();
  this?.close();

  const {
    dice: diceSelections,
    effectDice,
    total,
  } = await selectByType({ results, rollType });

  Log$7('rollDice.default diceSelections:', diceSelections);

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

const Log$6 = Logger();

const getBlankCustomAdd = () => ({
  dice: [8],
  hasHitches: true,
  parentName: null,
  name: '',
  rollsSeparately: false,
});

class DicePool extends FormApplication {
  constructor() {
    super();

    this.customAdd = getBlankCustomAdd();

    this.pool = [];
    this.rollMode = game.settings.get('core', 'rollMode');
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
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
      width: 480,
    })
  }

  getData() {
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

    Log$6('DicePool.getData data:', data);

    return data
  }

  _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);

    this.customAdd = {
      ...this.customAdd,
      ...expandedData.customAdd,
    };

    this.rollMode = expandedData.rollMode;

    Log$6(
      'DicePool._updateObject event, expandedData, this.rollMode:',
      event,
      expandedData,
      this.rollMode
    );
  }

  activateListeners(html) {
    super.activateListeners(html);

    const [$html] = html;

    fieldListeners($html);

    diceSelectListener(
      $html,
      {
        addDie: this.onAddDie.bind(this),
        changeDie: this.onChangeDie.bind(this),
        removeDie: this.onRemoveDie.bind(this),
      }
    );

    $html
      .querySelector('#DicePool-add-custom-trait')
      .addEventListener('click', this.addCustomTrait.bind(this));

    $html
      .querySelector('#DicePool-clear')
      ?.addEventListener('click', () => {
        this.clear();
        this.render(true);
      });

    addListeners(
      $html,
      '.DicePool-remove-trait',
      'click',
      this.removeTrait.bind(this)
    );

    $html
      .querySelector('#DicePool-reset-custom-trait')
      .addEventListener('click', this.resetCustomTrait.bind(this));

    $html
      .querySelector('#DicePool-roll-effect')
      ?.addEventListener('click', () => this._rollDice('effect'));

    $html
      .querySelector('#DicePool-roll-select')
      ?.addEventListener('click', () => this._rollDice('select'));

    $html
      .querySelector('#DicePool-roll-total')
      ?.addEventListener('click', () => this._rollDice('total'));

    $html
      .querySelector('#DicePool-rolls-separately')
      .addEventListener('change', event => this._onChangeRollsSeparately(event, html));
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
      traitIndex,
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

  async _rollDice(rollType) {
    Log$6('DicePool._rollDice this.pool, rollType:', this.pool, rollType);

    await rollDice.call(this, this.pool, rollType, this.rollMode);
  }

  _onChangeRollsSeparately(event, [$html]) {
    const $target = event.currentTarget;
    const isRolledSeparately = $target.checked;

    const $hasHitchesCheckbox = $html
      .querySelector('#DicePool-has-hitches');

    $hasHitchesCheckbox.disabled = !isRolledSeparately;
    $hasHitchesCheckbox.checked = !isRolledSeparately;

    $hasHitchesCheckbox
      .closest('.field-checkbox')
      .classList
      .toggle('field-disabled');
  }

  async addCustomTrait(event) {
    event.preventDefault();

    const matchingSourceIndex = this.pool
      .findIndex(sourceGroup => sourceGroup.source === 'Custom');

    if (matchingSourceIndex < 0) {
      this.pool = [...this.pool, {
        source: 'Custom',
        traits: [this.customAdd],
      }];
    } else {
      this.pool[matchingSourceIndex].traits = [
        ...this.pool[matchingSourceIndex].traits,
        this.customAdd,
      ];
    }

    this.resetCustomTrait();
  }

  addToPool(event, $addToPoolButton) {
    const $rollResult = $addToPoolButton.closest('.RollResult');

    this.pool = Array
      .from($rollResult.querySelectorAll('.RollResult-source'))
      .map($sourceGroup => ({
        source: $sourceGroup.dataset.source ?? null,
        traits: Array
          .from($sourceGroup.querySelectorAll('.RollResult-trait'))
          .map($trait => ({
            dice: Array
              .from($trait.querySelectorAll('.cp-die .number'))
              .map($number => parseInt($number.innerText, 10)),
            hasHitches: $trait.dataset.hasHitches !== 'false',
            name: $trait.dataset.name ?? null,
            parentName: $trait.dataset.parentName ?? null,
            rollsSeparately: $trait.dataset.rollsSeparately !== 'false',
          })),
      }));
  }

  clear() {
    this.customAdd = getBlankCustomAdd();

    this.pool = [];
  }

  async onAddDie(event, { target }) {
    const targetTrait = this._getTraitByTarget(event, target);

    targetTrait.dice = [
      ...targetTrait.dice,
      targetTrait.dice[targetTrait.dice.length - 1] ?? 8,
    ];

    await this.render(true);
  }

  async onChangeDie(event, { index, target, value }) {
    const targetTrait = this._getTraitByTarget(event, target);

    targetTrait.dice = targetTrait.dice.map((die, dieIndex) => {
      return dieIndex === index ? value : die
    });

    await this.render(true);
  }

  async onRemoveDie(event, { index, target }) {
    const targetTrait = this._getTraitByTarget(event, target);

    targetTrait.dice = targetTrait.dice
      .filter((die, dieIndex) => dieIndex !== index);

    await this.render(true);
  }

  async removeTrait(event) {
    const trait = event.currentTarget.closest('.DicePool-trait');

    const {
      sourceIndex,
      traitIndex,
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

  async toggle() {
    if (!this.rendered) {
      await this.render(true);
    } else {
      this.close();
    }
  }
}

const COLORS$2 = {
  black: '#231f20',
  darkGreen: '#007547',
  green: '#15b054',
  grey: '#b2b3b7',
  lightGreen: '#d8ecdd',
  lighterGreen: '#eaf5ed',
  lightGrey: '#f2f3f4',
  red: '#c50852',
  white: '#ffffff',
};

var cortexPrime = {
  bodyBackground_color: COLORS$2.white,
  bodyBackgroundColorOpacity: 1,
  bodyBackground_image: null,
  bodyBackgroundImageOpacity: 0.5,
  bodyBackgroundImagePosition: 'center',
  bodyBackgroundImageRepeat: 'no-repeat',
  bodyBackgroundImageSize: 'cover',
  bodyFont_color: COLORS$2.black,
  bodyFontSize_rem: 14,
  bodyFontWeight: '400',
  border_input_color: COLORS$2.darkGreen,
  border_input_position: 'bottom',
  border_input_style: 'solid',
  border_input_width: 2,
  border_buttonPrimary_color: null,
  border_buttonPrimary_position: 'none',
  border_buttonPrimary_style: 'solid',
  border_buttonPrimary_width: 0,
  border_buttonSecondary_color: null,
  border_buttonSecondary_position: 'none',
  border_buttonSecondary_style: 'solid',
  border_buttonSecondary_width: 0,
  border_section_color: COLORS$2.red,
  border_section_position: 'all',
  border_section_style: 'solid',
  border_section_width: 2,
  buttonBackgroundPrimary_color: COLORS$2.darkGreen,
  buttonBackgroundSecondary_color: COLORS$2.red,
  buttonFontPrimary_color: COLORS$2.white,
  buttonFontSecondary_color: COLORS$2.white,
  buttonPrimaryBorderRadius_rem: 0,
  buttonSecondaryBorderRadius_rem: 0,
  chosenFill_color: COLORS$2.white,
  chosenNumber_color: COLORS$2.black,
  chosenStroke_color: COLORS$2.red,
  dieRatingFill_color: COLORS$2.red,
  dieRatingNumber_color: COLORS$2.white,
  dieRatingStroke_color: COLORS$2.red,
  effectFill_color: COLORS$2.darkGreen,
  effectNumber_color: COLORS$2.white,
  effectStroke_color: COLORS$2.green,
  heading1Casing: 'uppercase',
  heading1_color: COLORS$2.red,
  heading1Size_rem: 16,
  heading1Style: 'normal',
  heading1Weight: 700,
  heading2Casing: 'uppercase',
  heading2_color: COLORS$2.darkGreen,
  heading2Size_rem: 14,
  heading2Style: 'normal',
  heading2Weight: 700,
  hitchFill_color: COLORS$2.black,
  hitchNumber_color: COLORS$2.white,
  hitchStroke_color: COLORS$2.red,
  inputBackground_color: COLORS$2.lighterGreen,
  inputBorderRadius_rem: 0,
  inputFont_color: COLORS$2.black,
  inputLabelCasing: 'capitalize',
  inputLabel_color: COLORS$2.black,
  inputLabelSize_rem: 12,
  inputLabelStyle: 'normal',
  inputLabelWeight: 700,
  sectionBackgroundAlt_color: COLORS$2.lightGrey,
  sectionBackgroundAlt2_color: COLORS$2.lightGreen,
  sectionBackground_color: COLORS$2.white,
  sectionBackgroundColorOpacity: 1,
  sectionBackground_image: null,
  sectionBackgroundImageOpacity: 0,
  sectionBackgroundImagePosition: 'center',
  sectionBackgroundImageRepeat: 'no-repeat',
  sectionBackgroundImageSize: 'cover',
  sectionBorderRadius_rem: 0,
  selectedFill_color: COLORS$2.lightGreen,
  selectedNumber_color: COLORS$2.black,
  selectedStroke_color: COLORS$2.red,
  separator_color: COLORS$2.red,
  separatorStyle: 'solid',
  separatorWidth_px: 2,
  traitCasing: 'capitalize',
  trait_color: COLORS$2.black,
  traitSize_rem: 14,
  traitStyle: 'normal',
  traitWeight: 700,
  unchosenFill_color: COLORS$2.white,
  unchosenNumber_color: COLORS$2.grey,
  unchosenStroke_color: COLORS$2.grey,
};

const COLORS$1 = {
  black: '#141c27',
  darkGrey: '#424c59',
  darkerGrey: '#27303d',
  darkestGrey: '#1f2834',
  green: '#2d5931',
  grey: '#82939f',
  lightBlue: '#56ccf2',
  lightGreen: '#c0e2ca',
  lightRed: '#fc2755',
  red: '#c3255a',
  transparent: '',
  white: '#f5f8fa',
};

var cortexPrimeDark = {
  bodyBackground_color: COLORS$1.black,
  bodyBackgroundColorOpacity: 1,
  bodyBackground_image: null,
  bodyBackgroundImageOpacity: 0.5,
  bodyBackgroundImagePosition: 'center',
  bodyBackgroundImageRepeat: 'no-repeat',
  bodyBackgroundImageSize: 'cover',
  bodyFont_color: COLORS$1.white,
  bodyFontSize_rem: 14,
  bodyFontWeight: '400',
  border_input_color: COLORS$1.grey,
  border_input_position: 'all',
  border_input_style: 'solid',
  border_input_width: 1,
  border_buttonPrimary_color: COLORS$1.lightBlue,
  border_buttonPrimary_position: 'none',
  border_buttonPrimary_style: 'solid',
  border_buttonPrimary_width: 1,
  border_buttonSecondary_color: COLORS$1.lightRed,
  border_buttonSecondary_position: 'none',
  border_buttonSecondary_style: 'solid',
  border_buttonSecondary_width: 1,
  border_section_color: COLORS$1.grey,
  border_section_position: 'all',
  border_section_style: 'solid',
  border_section_width: 2,
  buttonBackgroundPrimary_color: COLORS$1.lightBlue,
  buttonBackgroundSecondary_color: COLORS$1.lightRed,
  buttonPrimaryBorderRadius_rem: 0,
  buttonSecondaryBorderRadius_rem: 0,
  buttonFontPrimary_color: COLORS$1.black,
  buttonFontSecondary_color: COLORS$1.white,
  chosenFill_color: COLORS$1.white,
  chosenNumber_color: COLORS$1.black,
  chosenStroke_color: COLORS$1.red,
  dieRatingFill_color: COLORS$1.red,
  dieRatingNumber_color: COLORS$1.white,
  dieRatingStroke_color: COLORS$1.red,
  effectFill_color: COLORS$1.green,
  effectNumber_color: COLORS$1.white,
  effectStroke_color: COLORS$1.green,
  heading1Casing: 'uppercase',
  heading1_color: COLORS$1.white,
  heading1Size_rem: 16,
  heading1Style: 'normal',
  heading1Weight: 700,
  heading2Casing: 'uppercase',
  heading2_color: COLORS$1.lightRed,
  heading2Size_rem: 15,
  heading2Style: 'normal',
  heading2Weight: 700,
  hitchFill_color: COLORS$1.black,
  hitchNumber_color: COLORS$1.white,
  hitchStroke_color: COLORS$1.red,
  inputBackground_color: COLORS$1.transparent,
  inputBorderRadius_rem: 0,
  inputFont_color: COLORS$1.white,
  inputLabelCasing: 'capitalize',
  inputLabel_color: COLORS$1.lightBlue,
  inputLabelSize_rem: 12,
  inputLabelStyle: 'normal',
  inputLabelWeight: 700,
  sectionBackgroundAlt_color: COLORS$1.darkestGrey,
  sectionBackgroundAlt2_color: COLORS$1.darkerGrey,
  sectionBackground_color: COLORS$1.black,
  sectionBackgroundColorOpacity: 1,
  sectionBackground_image: null,
  sectionBackgroundImageOpacity: 0,
  sectionBackgroundImagePosition: 'center',
  sectionBackgroundImageRepeat: 'no-repeat',
  sectionBackgroundImageSize: 'cover',
  sectionBorderRadius_rem: 0,
  selectedFill_color: COLORS$1.darkestGrey,
  selectedNumber_color: COLORS$1.lightBlue,
  selectedStroke_color: COLORS$1.lightBlue,
  separator_color: COLORS$1.lightRed,
  separatorStyle: 'solid',
  separatorWidth_px: 2,
  traitCasing: 'capitalize',
  trait_color: COLORS$1.white,
  traitSize_rem: 14,
  traitStyle: 'normal',
  traitWeight: 700,
  unchosenFill_color: COLORS$1.darkGrey,
  unchosenNumber_color: COLORS$1.grey,
  unchosenStroke_color: COLORS$1.grey,
};

const COLORS = {
  black: '#161312',
  blue: '#005590',
  brown: '#453b35',
  darkBrown: '#2a251f',
  darkerBrown: '#201b15',
  gold: '#d2942a',
  green: '#3b863e',
  lightBlue: '#48c0E9',
  lightBrown: '#5f5952',
  lighterBrown: '#bcb4ac',
  lighterBlue: '#afe2f3',
  lightGreen: '#afeaae',
  transparent: '',
  white: '#fff8ef',
};

var talesOfXadia = {
  bodyBackground_color: COLORS.black,
  bodyBackgroundColorOpacity: 1,
  bodyBackground_image: null,
  bodyBackgroundImageOpacity: 0.5,
  bodyBackgroundImagePosition: 'center',
  bodyBackgroundImageRepeat: 'no-repeat',
  bodyBackgroundImageSize: 'cover',
  bodyFont_color: COLORS.white,
  bodyFontSize_rem: 14,
  bodyFontWeight: '400',
  border_input_color: COLORS.lighterBrown,
  border_input_position: 'all',
  border_input_style: 'solid',
  border_input_width: 1,
  border_buttonPrimary_color: COLORS.lightBlue,
  border_buttonPrimary_position: 'none',
  border_buttonPrimary_style: 'solid',
  border_buttonPrimary_width: 1,
  border_buttonSecondary_color: COLORS.gold,
  border_buttonSecondary_position: 'none',
  border_buttonSecondary_style: 'solid',
  border_buttonSecondary_width: 1,
  border_section_color: COLORS.lightBrown,
  border_section_position: 'all',
  border_section_style: 'solid',
  border_section_width: 2,
  buttonBackgroundPrimary_color: COLORS.lightBlue,
  buttonBackgroundSecondary_color: COLORS.gold,
  buttonFontPrimary_color: COLORS.black,
  buttonFontSecondary_color: COLORS.black,
  buttonPrimaryBorderRadius_rem: 0,
  buttonSecondaryBorderRadius_rem: 0,
  chosenFill_color: COLORS.blue,
  chosenNumber_color: COLORS.white,
  chosenStroke_color: COLORS.lighterBlue,
  dieRatingFill_color: COLORS.blue,
  dieRatingNumber_color: COLORS.white,
  dieRatingStroke_color: COLORS.blue,
  effectFill_color: COLORS.green,
  effectNumber_color: COLORS.white,
  effectStroke_color: COLORS.lightGreen,
  heading1Casing: 'capitalize',
  heading1_color: COLORS.white,
  heading1Size_rem: 16,
  heading1Style: 'normal',
  heading1Weight: 700,
  heading2Casing: 'uppercase',
  heading2_color: COLORS.gold,
  heading2Size_rem: 14,
  heading2Style: 'normal',
  heading2Weight: 700,
  hitchFill_color: COLORS.black,
  hitchNumber_color: COLORS.white,
  hitchStroke_color: COLORS.lightBlue,
  inputBackground_color: COLORS.transparent,
  inputBorderRadius_rem: 4,
  inputFont_color: COLORS.white,
  inputLabelCasing: 'capitalize',
  inputLabel_color: COLORS.lighterBrown,
  inputLabelSize_rem: 12,
  inputLabelStyle: 'normal',
  inputLabelWeight: 700,
  sectionBackgroundAlt_color: COLORS.darkBrown,
  sectionBackgroundAlt2_color: COLORS.brown,
  sectionBackground_color: COLORS.darkerBrown,
  sectionBackgroundColorOpacity: 1,
  sectionBackground_image: null,
  sectionBackgroundImageOpacity: 0,
  sectionBackgroundImagePosition: 'center',
  sectionBackgroundImageRepeat: 'no-repeat',
  sectionBackgroundImageSize: 'cover',
  sectionBorderRadius_rem: 4,
  selectedFill_color: COLORS.white,
  selectedNumber_color: COLORS.black,
  selectedStroke_color: COLORS.gold,
  separator_color: COLORS.gold,
  separatorStyle: 'solid',
  separatorWidth_px: 2,
  traitCasing: 'capitalize',
  trait_color: COLORS.gold,
  traitSize_rem: 14,
  traitStyle: 'normal',
  traitWeight: 700,
  unchosenFill_color: COLORS.white,
  unchosenNumber_color: COLORS.black,
  unchosenStroke_color: COLORS.black,
};

var presetThemes = {
  'Cortex Prime': cortexPrime,
  'Cortex Prime - Dark': cortexPrimeDark,
  'Tales of Xadia': talesOfXadia,
};

const setThemeProperties = properties => {
  const $root = document
    .querySelector(':root');

  if (!properties) {
    const { selectedTheme, customList: customThemeList } = game.settings.get('cortexprime', 'themes');

    properties = presetThemes[selectedTheme] ?? customThemeList[selectedTheme] ?? {};
  }

  const { borderProperties, mainProperties } = Object.entries(properties)
    .reduce((acc, [property, value]) => {
      const isColor = property?.endsWith('_color');

      if (property?.startsWith('border_')) {
        const splitProperty = property.split('_');

        const namespace = splitProperty[1];
        const prop = splitProperty[2];
        value = isColor ? (value || 'transparent') : value;

        acc.borderProperties = {
          ...acc.borderProperties,
          [namespace]: {
            ...(acc.borderProperties[namespace] ?? {}),
            [prop]: value,
          },
        };
      } else {
        if (property?.endsWith('_rem')) {
          const splitProperty = property.split('_rem');

          property = splitProperty[0];

          const numValue = parseInt(value, 10) || 0;

          value = numValue === 0
            ? 0
            : `${numValue / 16}rem`;
        } else if (property?.endsWith('_image')) {
          const splitProperty = property.split('_image');

          property = `${splitProperty[0]}Image`;

          value = value
            ? value.startsWith('http')
              ? `url('${value}')`
              : `url('/${value}')`
            : 'none';
        } else if (isColor) {
          const splitProperty = property.split('_color');

          property = `${splitProperty[0]}Color`;

          value = value || 'transparent';
        } else if (property?.endsWith('_px')) {
          const splitProperty = property.split('_px');

          property = splitProperty[0];
          value = `${value}px`;
        }

        acc.mainProperties.push([property, value]);
      }

      return acc
    }, { borderProperties: {}, mainProperties: [] });

  Object.entries(borderProperties).forEach(([namespace, values]) => {
    const position = values.position ?? 'all';
    const width = values.width ?? 1;

    let widthValue;

    switch (position) {
      case 'none':
        widthValue = '0';
        break
      case 'bottom':
        widthValue = `0 0 ${width}px`;
        break
      case 'top':
        widthValue = `${width}px 0 0`;
        break
      case 'left':
        widthValue = `0 0 0 ${width}px`;
        break
      case 'right':
        widthValue = `0 ${width}px 0 0`;
        break
      case 'top-and-bottom':
        widthValue = `${width}px 0 ${width}px`;
        break
      case 'left-and-right':
        widthValue = `0 ${width}px 0`;
        break
      default:
        widthValue = `${width}px`;
    }

    $root
      .style
      .setProperty(
        `--cp-${camelCasetoKebabCase(namespace)}-border`,
        `${values.style ?? 'solid'} ${values.color ?? 'black'}`
      );

    $root
      .style
      .setProperty(
        `--cp-${camelCasetoKebabCase(namespace)}-border-width`,
        widthValue
      );
  });

  mainProperties.forEach(([property, value]) => {
    $root
      .style
      .setProperty(`--cp-${camelCasetoKebabCase(property)}`, value);
  });
};

var ready = async () => {
  game.cortexprime.DicePool = new DicePool();

  const themes = game.settings.get('cortexprime', 'themes');

  const themeOptions = {
    ...presetThemes,
    ...themes.customList,
  };

  setThemeProperties(themeOptions[themes.selectedTheme]);
};

var renderChatLog = (log, [$html], data) => {
  $html
    .querySelector('#chat-log')
    .addEventListener('click', event => {
      const $displayToggle = event.target.closest('.display-toggle');
      const $rollResultAddToPool = event.target.closest('.RollResult-add-to-pool');
      const $rollResultReRoll = event.target.closest('.RollResult-re-roll');

      if ($displayToggle) {
        displayToggleMethod(event, $displayToggle);
        return
      }

      if ($rollResultAddToPool) {
        game.cortexprime.DicePool.addToPool(event, $rollResultAddToPool);
        game.cortexprime.DicePool.render(true);
        return
      }

      if ($rollResultReRoll) {
        game.cortexprime.DicePool.addToPool(event, $rollResultReRoll);
        game.cortexprime.DicePool._rollDice('select');
        game.cortexprime.DicePool.clear();

      }
    });
};

const getHtml = (value, options) => {
  return `<div class="die-result${
    options.hash.class ? ` ${options.hash.class}` : ''
  }" `
    + `data-die-rating="${options.hash.dieRating}" ${
      options.hash.key ? `data-key="${options.hash.key}" ` : ''
    }${options.hash.resultGroupIndex || options.hash.resultGroupIndex === 0 ? `data-result-group-index="${options.hash.resultGroupIndex}" ` : ''
    }data-type="${options.hash.type}" `
    + `data-value="${value}"`
    + '>'
    + '<div class="die-wrapper">'
    + `<div class="die-container">${
      getDieIcon(options.hash.dieRating, options.hash.type, value)
    }</div>`
    + `</div>${
      options.hash.hideLabel ? '' : `<span class="die-result-label">d${options.hash.dieRating}</span>`
    }</div>`
};

var dieResult = (value, options) => {
  return new Handlebars.SafeString(getHtml(value, options))
};

var renderChatMessage = (message, [$html], data) => {
  const $rollResult = $html.querySelector('.RollResult-main');

  if ($rollResult) {
    $html.classList.add('cortexprime', 'RollResult', 'theme-body');

    $rollResult
      .querySelectorAll('.chat-die')
      .forEach($die => {
        const {
          dieRating,
          hideLabel,
          resultGroupIndex,
          type,
          value,
        } = $die.dataset;

        const html = getHtml(value, {
          hash: {
            class: 'RollResult-die-result',
            dieRating,
            hideLabel: !!hideLabel,
            resultGroupIndex,
            type,
          },
        });

        $die.outerHTML = html;
      });
  }
};

var renderSceneControls = (controls, [$html]) => {
  const dicePoolButton =
    `<li class="dice-pool-control" data-control="dice-pool" title="${game.i18n.localize('DicePool')}">`
    + '<i class="fas fa-dice"></i>'
    + '<ol class="control-tools"></ol>'
    + '</li>';

  $html
    .querySelector('.main-controls')
    .innerHTML += dicePoolButton;

  const $dicePoolControl = $html
    .querySelector('.dice-pool-control');

  $dicePoolControl
    .classList
    .remove('control-tool');

  $dicePoolControl
    .addEventListener('click', async () => {
      await game.cortexprime.DicePool.toggle();
    });
};

var hooks = () => {
  Hooks.on('ready', ready);
  Hooks.on('renderChatLog', renderChatLog);
  Hooks.on('renderChatMessage', renderChatMessage);
  Hooks.on('renderSceneControls', renderSceneControls);
};

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
};

const getSelect = (options, { dieIndex, dieRating, removable }) => {
  const diceOptions = [4, 6, 8, 10, 12]
    .filter(rating => {
      return (
        !options.hash.minDieRating
        || rating >= options.hash.minDieRating
      ) && (
        !options.hash.maxDieRating
        || rating <= options.hash.maxDieRating
      )
    });
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
};

var diceSelect = (val, options) => {
  const type = options.hash.type ?? 'die-rating';
  const value = val
    ? typeof val === 'number'
      ? [val]
      : val
    : options.hash.defaultDie
      ? [options.hash.defaultDie]
      : [];
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
};

var fieldCheckbox = (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'wrapperClass',
  ];

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
      .join(' ')
    }>${
      options.hash.label ? '<span class="field-label' : ''
    }${options.hash.label && options.hash.labelClass ? ` ${options.hash.labelClass}` : ''
    }${options.hash.label ? `">${options.hash.label}</span>` : ''
    }${options.hash.label ? '</label>' : '</div>'
    }${options.hash.hint ? `<p class="field-hint">${options.hash.hint}</p>` : ''
    }</div>`
  )
};

var fieldInput = type => (value, options) => {
  const inputHashIgnore = [
    'append',
    'class',
    'hint',
    'label',
    'labelClass',
    'noEdit',
    'wrapperClass',
  ];

  return new Handlebars.SafeString(
    `<div class="field field-${type}${
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
      ? `<p class="field-view-value">${value}${options.hash.append || ''}</p>`
      : `${options.hash.append ? '<div class="flex gap-1">' : ''}<input type="${type}" ${
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
          .join(' ')
      } value="${value ?? ''}"`
          + `>${
            options.hash.append ? `${options.hash.append}</div>` : ''}`
    }${options.hash.label && !options.hash.noEdit ? '</label>' : '</div>'
    }${options.hash.hint && !options.hash.noEdit ? `<p class="field-hint">${options.hash.hint}</p>` : ''
    }</div>`
  )
};

var fieldSelect = (value, items, name, val, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'noEdit',
    'wrapperClass',
  ];

  const getOptions = (items, value, name, val) => {
    return items
      .map(item => {
        return item.label
          ? item.options?.length > 0
            ? `<optgroup label="${item.label}">${
              getOptions(item.options, value, name, val)
            }</optgroup>`
            : null
          : `<option value="${item[val]}"${

            item.placeholder
              ? ` disabled ${!value ? 'selected' : 'hidden'}>`
              : item[val] === value
                ? ' selected>'
                : '>'
          }${item[name]}</option>`
      })
      .filter(itemString => itemString)
      .join('')
  };

  const getViewValue = value => {
    const matchingValue = items.find(item => item[val] === value);

    return matchingValue?.[name]
  };

  return new Handlebars.SafeString(
    `<div class="field field-select${
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
      ? `<p class="field-view-value">${getViewValue(value)}</p>`
      : `<select ${
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
          .join(' ')
      }>${
        getOptions(items, value, name, val)
      }</select>`
    }${options.hash.label && !options.hash.noEdit ? '</label>' : '</div>'
    }${options.hash.hint && !options.hash.noEdit ? `<p class="field-hint">${options.hash.hint}</p>` : ''
    }</div>`
  )
};

var fieldTextarea = (value, options) => {
  const inputHashIgnore = [
    'class',
    'hint',
    'label',
    'labelClass',
    'noEdit',
    'wrapperClass',
  ];

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
          .join(' ')
      }>${
        value ?? ''
      }</textarea>${
        options.hash.append ? `${options.hash.append}</div>` : ''}`
    }${options.hash.label && !options.hash.noEdit ? '</label>' : '</div>'
    }${options.hash.hint && !options.hash.noEdit ? `<p class="field-hint">${options.hash.hint}</p>` : ''
    }</div>`
  )
};

const registerHandlebarHelpers = () => {
  Handlebars.registerHelper({
    add: (a, b) => Number(a) + Number(b),
    get: (list, key) => list[key] ?? false,
    includes: (arr, item) => arr.includes(item),
    length: value => value?.length ?? null,
    sub: (a, b) => Number(a) - Number(b),
    '??': (a, b) => a ?? b,
  });

  Handlebars.registerHelper('times', (n, block) => {
    let accum = '';
    for (let i = 0; i < n; ++i) accum += block.fn(i);
    return accum
  });

  Handlebars.registerHelper('diceSelect', diceSelect);
  Handlebars.registerHelper('dieResult', dieResult);
  Handlebars.registerHelper('fieldNumber', fieldInput('number'));
  Handlebars.registerHelper('fieldCheckbox', fieldCheckbox);
  Handlebars.registerHelper('fieldSelect', fieldSelect);
  Handlebars.registerHelper('fieldText', fieldInput('text'));
  Handlebars.registerHelper('fieldTextarea', fieldTextarea);
};

const preloadHandlebarsTemplates = async () => {
  const templatePaths = [
    'fields/color',
    'fields/image',
    'ActorSettings/ActorTypePage',
    'ItemSettings/Descriptor',
    'ItemSettings/Descriptors',
    'ItemSettings/SubtraitPage',
    'ItemSettings/SubtraitType',
    'ItemSettings/TraitPage',
    'SortableListSection',
    'SortableListItem',
    'themes/body',
    'themes/buttons',
    'themes/dice',
    'themes/headings',
    'themes/inputs',
    'themes/misc',
    'themes/sections',
  ]
    .map(template => `systems/cortexprime/system/templates/partials/${template}.html`);

  return loadTemplates(templatePaths)
};

var sockets = ({ payload, type }) => {
  switch (type) {
    case 'setThemeProperties':
      setThemeProperties();
  }
};

const addDragSort = ($dragSortHandle, callback) => {
  $dragSortHandle.setAttribute('draggable', true);
  $dragSortHandle.ondrag = handleItemDrag;
  $dragSortHandle.ondragend = event => handleItemDrop(event, callback);
};

const dragSort = ($html, callback) => {
  $html
    .querySelectorAll('.drag-sort-handle')
    .forEach($dragSortHandle => addDragSort($dragSortHandle, callback));
};

const handleItemDrag = event => {
  const $dragSortItem = event.currentTarget.closest('.drag-sort-item');
  const $dragSortList = $dragSortItem.parentNode;

  const xPos = event.clientX;
  const yPos = event.clientY;

  $dragSortItem.classList.add('drag-sort-item--active');

  const $swapItem = document.elementFromPoint(xPos, yPos) ?? $selectedItem;

  if ($dragSortList === $swapItem.parentNode) {
    const $dragSortSwapItem = $swapItem !== $dragSortItem.nextSibling
      ? $swapItem
      : $swapItem.nextSibling;

    $dragSortList.insertBefore($dragSortItem, $dragSortSwapItem);
  }
};

const handleItemDrop = (event, callback) => {
  const $dragSortItem = event.target.closest('.drag-sort-item');

  $dragSortItem
    .classList
    .remove('drag-sort-item--active');

  callback($dragSortItem.parentNode);
};

const Log$5 = Logger();

class CpActorSettings extends FormApplication {
  constructor() {
    super();

    const actorSettings = game.settings.get('cortexprime', 'actorTypes');

    this.actorSettings = actorSettings;

    Log$5('CpActorSettings.constructor actorSettings', actorSettings);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings', 'actor-settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ActorSettings',
      left: 400,
      resizable: false,
      scrollY: ['#ActorSettings-form-body'],
      submitOnChange: false,
      submitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpActorSettings.html',
      title: localizer('CP.ActorSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const data = this.actorSettings;

    Log$5('CPActorSettings.getData data:', data);

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);

    Log$5('CPActorSettings._updateSettings expandedData:', expandedData);

    await this.save(event.target, expandedData);
  }

  activateListeners(html) {
    super.activateListeners(html);
    const [$html] = html;

    dragSort($html, this._onDragSortDrop.bind(this, $html));

    addListeners(
      $html,
      '#ActorSettings-main',
      'click',
      event => {
        const $goToPage = event.target.closest('.go-to-page');

        if ($goToPage) {
          this.goToPage(event, $html, $goToPage);

        }
      }
    );

    addListeners(
      $html,
      '.actor-types-list-section',
      'click',
      event => {
        const $addActorType = event.target.closest('.add-actor-type');

        if ($addActorType) {
          this.addActorType($html, $addActorType);
          return
        }

        const $duplicateActorType = event.target.closest('.duplicate-actor-type');

        if ($duplicateActorType) {
          this.duplicateActorType($html, $duplicateActorType);
          return
        }

        const $deleteActorType = event.target.closest('.delete-actor-type');

        if ($deleteActorType) {
          this.deletePageItem($html, $deleteActorType, '.actor-types-list-item');
        }
      }
    );

    addListeners(
      $html,
      '.actor-type-pages',
      'change',
      event => {
        const $actorTypeName = event
          .target
          .closest('.ActorSettings-actor-type-field-name-input');

        if ($actorTypeName) {
          this.updateActorTypeName($html, $actorTypeName);

        }
      }
    );

    $html
      .querySelector('.settings-reset')
      .addEventListener('click', this.reset.bind(this));
  }

  async addActorType($html, $addActorType) {
    const id = uuid();

    await this._addPageItem(
      $html,
      $addActorType,
      {
        id,
        itemName: 'New Actor Type',
        itemsPath: 'actorTypes',
        listTypePlural: 'actor-types',
        listTypeSingular: 'actor-type',
        templatePath: 'ActorSettings/ActorTypePage.html',
        templateData: {
          actorType: {
            id,
            name: 'New Actor Type',
          },
        },
      }
    );

    this._switchPage($html, { targetId: id });
  }

  async close() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.CloseConfirmTitle'),
      content: localizer('CP.CloseConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      return super.close()
    }
  }

  async deletePageItem($html, $deletePage, parentSelector) {
    const $parentListItem = $deletePage.closest(parentSelector);

    const { id } = $parentListItem.dataset;
    const $dragSortList = $parentListItem.closest('.drag-sort-list');

    const listItemName = $parentListItem
      .querySelector('.list-item-name')
      .textContent;

    const confirmed = await Dialog.confirm({
      title: localizer('CP.DeleteConfirmTitle'),
      content: `${localizer('CP.DeleteConfirmContentStart')} ${listItemName}?`,
      defaultYes: false,
    });

    if (confirmed) {
      $parentListItem.remove();

      $html
        .querySelector(`.ActorSettings-page[data-id="${id}"]`)
        .remove();

      this._reapplySortSequence($html, $dragSortList);
    }

    return confirmed
  }

  async duplicateActorType($html, $duplicateActorType) {
    const id = uuid();

    const { id: currentId } = $duplicateActorType
      .closest('.actor-types-list-item')
      .dataset;

    const $currentActorTypePage = $html
      .querySelector(`.ActorSettings-page[data-id="${currentId}"]`);

    const name = `${$currentActorTypePage
      ?.querySelector(`[name="actorTypes.${currentId}.name"]`)
      ?.value ?? 'New Actor Type'
    } (duplicate)`;

    await this._addPageItem(
      $html,
      $duplicateActorType,
      {
        id,
        itemName: name,
        itemsPath: 'actorTypes',
        listTypePlural: 'actor-types',
        listTypeSingular: 'actor-type',
        templatePath: 'ActorSettings/ActorTypePage.html',
        templateData: {
          actorType: {
            id,
            name,
          },
        },
      }
    );

    this._switchPage($html, { targetId: id });
  }

  async goToPage(event, $html, $goToPage) {
    const {
      currentId,
      targetId,
    } = $goToPage?.dataset ?? event.currentTarget.dataset;

    this._switchPage($html, { currentId, targetId });
  }

  async reset() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.ResetConfirmTitle'),
      content: localizer('CP.ResetConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      this.render(true);
    }
  }

  async save($html, expandedData) {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.SaveConfirmTitle'),
      content: localizer('CP.SaveConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      const sequenceSort = ([_, aValue], [__, bValue]) => {
        const aSortValue = parseInt(aValue.sequence, 10);
        const bSortValue = parseInt(bValue.sequence, 10);

        return bSortValue > aSortValue.sequence
          ? -1
          : aSortValue > bSortValue
            ? 1
            : 0
      };

      const actorTypes = objectSortToArray(expandedData.actorTypes, sequenceSort)
        .map(actorType => {
          delete actorType.sequence;

          return actorType
        });

      const serializedData = {
        actorTypes,
      };

      Log$5('CpActorSettings.save serializedData', serializedData);

      game.settings.set('cortexprime', 'actorTypes', serializedData);

      Dialog.prompt({
        title: localizer('CP.PromptSettingsSaveTitle'),
        content: localizer('CP.PromptSettingsSaveContent'),
      });
    }
  }

  updateActorTypeName($html, $actorTypeName) {
    const $actorTypePage = $actorTypeName.closest('.actor-type-page');

    const { id } = $actorTypePage.dataset;

    const actorTypeName = $actorTypeName.value;

    $actorTypePage
      .querySelector('.actor-type-page-name')
      .textContent = actorTypeName;

    $html
      .querySelector(`.actor-types-list-item[data-id="${id}"] .actor-types-list-item-name`)
      .textContent = actorTypeName;
  }

  async _addPageItem($html, $addListButton, payload) {
    const {
      id,
      itemName,
      itemsPath,
      listTypePlural,
      listTypeSingular,
      templatePath,
      templateData,
    } = payload;

    const $list = $addListButton
      .closest(`.${listTypePlural}-list-section`)
      .querySelector(`.${listTypePlural}-list`);

    const $listItems = $list
      .querySelectorAll(`.${listTypePlural}-list-item`);

    const sequence = $listItems.length;

    const listItemHtml = await renderTemplate(
      'systems/cortexprime/system/templates/partials/SortableListItem.html',
      {
        itemIndex: sequence,
        itemsPath: itemsPath,
        pluralClassAffix: listTypePlural,
        singularClassAffix: listTypeSingular,
        item: {
          id,
          name: itemName,
          sequence: sequence,
        },
      }
    );

    $list.insertAdjacentHTML('beforeend', listItemHtml);

    const $newListItem = $list
      .querySelector(`.${listTypePlural}-list-item[data-sort-sequence="${sequence}"]`);

    const $dragSortHandler = $newListItem
      .querySelector('.drag-sort-handle');

    addDragSort($dragSortHandler, () => this._onDragSortDrop($html, $list));

    const pageHtml = await renderTemplate(
      `systems/cortexprime/system/templates/partials/${templatePath}`,
      templateData
    );

    $html
      .querySelector(`.${listTypeSingular}-pages`)
      .insertAdjacentHTML('beforeend', pageHtml);

    this._switchPage($html, { targetId: id });
  }

  _onDragSortDrop($html, $dragSortList) {
    this._reapplySortSequence($html, $dragSortList);
  }

  _reapplySortSequence($html, $dragSortList) {
    Array.from($dragSortList.children)
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index;
        const $dragSortItemSequence = $item
          .querySelector('.drag-sort-item-sequence');

        if ($dragSortItemSequence) {
          $dragSortItemSequence.value = index;
        }
      });
  }

  _switchPage($html, { currentId, targetId }) {
    $html
      .querySelector(currentId ? `.ActorSettings-page[data-id="${currentId}"]` : '.list-page')
      .classList
      .add('hide');

    $html
      .querySelector(targetId ? `.ActorSettings-page[data-id="${targetId}"]` : '.list-page')
      .classList
      .remove('hide');
  }
}

// /** Theme Settings ***/
// // feat(0.3.0): Add temporary die
// // feat(0.3.0): Add a heading 3 and apply to "Preset Descriptors" in Item Settings

// /** * Dice Pool ***/
// // feat(1.0.0): preview button in DicePool to preview pool prior to rolling
// // // Use sockets to update and have a dropdown to choose which dice pool to view

// /** * Item Settings ***/
// // tweak(0.3.0): (FUTURE) when deleting trait or subtrait other sheets will be properly updated
// // tweak(0.3.0): Type image & update in item list

// /** * Item Sheets ***/
// // feat(0.3.0): getter for item type and selector (different message if missing item type rather than unchosen)
// // feat(0.3.0): Drag & Drop subtrait items onto trait item sheets
// // feat(0.3.0): Editing subtrait on a trait sheet will open a subtrait sheet

// /** * Actor Settings ***/
// // feat(0.3.0): Create settings page
// // feat(0.3.0): Layout options
// // feat(0.3.0): "Simple Traits" for dice, booleans and/or tags?, numbers, text, etc.
// // feat(1.0.0): Growth Tracking

// /** * Actor Sheets ***/
// // feat: temporary dice ratings
// // feat(0.3.0): Drag and Drop trait and subtrait items onto sheets

// /** * Misc Settings ***/
// // feat(0.3.0): expandable roll result traits setting (default not)

// /** * Misc ***/
// // feat(0.3.0): textarea icon interpolation
// // feat: Turn Order
// // feat(1.0.0): Quick access sheet
// // feat(0.3.0): Help Document/page

const Log$4 = Logger();

class CpThemeSettings extends FormApplication {
  constructor() {
    super();

    const themeSettings = game.settings.get('cortexprime', 'themes');

    Log$4('CpThemeSettings.constructor themeSettings', themeSettings);

    this.customThemes = themeSettings.customList;

    this.expandedSections = [];

    this.selectedTheme = themeSettings.selectedTheme;

    this.themeSelection = themeSettings.selectedTheme;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings', 'theme-settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ThemeSettings',
      left: 400,
      resizable: false,
      scrollY: ['#ThemeSettings-form-body'],
      submitOnChange: false,
      submitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpThemeSettings.html',
      title: localizer('CP.ThemeSettings'),
      top: 200,
      width: 600,
    })
  }

  get allThemes() {
    return {
      ...presetThemes,
      ...this.customThemes,
    }
  }

  get allThemeNames() {
    return Object.keys(this.allThemes)
  }

  get currentSettings() {
    return this.allThemes[this.selectedTheme]
  }

  get isPresetTheme() {
    return !!presetThemes[this.selectedTheme]
  }

  getData() {
    const data = {
      borderPositions: [
        { name: localizer('CP.None'), value: 'none' },
        { name: localizer('CP.All'), value: 'all' },
        { name: localizer('CP.Bottom'), value: 'bottom' },
        { name: localizer('CP.Top'), value: 'top' },
        { name: localizer('CP.Left'), value: 'left' },
        { name: localizer('CP.Right'), value: 'right' },
        { name: localizer('CP.TopAndBottom'), value: 'top-and-bottom' },
        { name: localizer('CP.LeftAndRight'), value: 'left-and-right' },
      ],
      currentSettings: this.currentSettings,
      expandedSections: this.expandedSections,
      isPresetTheme: this.isPresetTheme,
      selectedTheme: this.selectedTheme,
      themeOptions: [
        {
          label: localizer('CP.PresetThemes'),
          options: Object.keys(presetThemes)
            .map(themeName => ({ name: themeName, value: themeName })),
        },
        {
          label: 'Custom Themes',
          options: Object.keys(this.customThemes)
            .map(themeName => ({ name: themeName, value: themeName })),
        },
      ],
    };

    Log$4('CPThemeSettings.getData data:', data);

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);

    Log$4('CPThemeSettings._updateObject expandedData:', expandedData);

    const {
      selectedTheme,
    } = expandedData;

    this.selectedTheme = selectedTheme;

    await this.save(expandedData);
  }

  activateListeners(html) {
    super.activateListeners(html);

    const [$html] = html;

    fieldListeners($html);

    addListeners(
      $html,
      'file-picker',
      'change',
      this.onImageChange
    );

    addListeners(
      $html,
      '.image-remove',
      'click',
      this.removeImage
    );

    addListeners(
      $html,
      'color-picker',
      'change',
      this.onColorChange
    );

    addListeners(
      $html,
      '.display-toggle',
      'click',
      this.onDisplayToggle.bind(this)
    );

    $html
      .querySelector('#ThemeSettings-theme-select')
      ?.addEventListener('change', this.onChangeTheme.bind(this));

    $html
      .querySelector('#ThemeSettings-custom-theme-create')
      ?.addEventListener('click', () => this.createCustomTheme($html));

    $html
      .querySelector('#ThemeSettings-delete')
      ?.addEventListener('click', this.deleteTheme.bind(this));

    $html
      .querySelector('#ThemeSettings-preview')
      ?.addEventListener('click', this.preview.bind(this, html));

    $html
      .querySelector('#ThemeSettings-reset')
      ?.addEventListener('click', this.reset.bind(this));
  }

  async close() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.CloseConfirmTitle'),
      content: localizer('CP.CloseConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      this.expandedSections = [];

      setThemeProperties();

      return super.close()
    }
  }

  async createCustomTheme($html) {
    const customThemeName = (
      $html
        .querySelector('#ThemeSettings-custom-theme-name')
        .value ?? ''
    ).trim();

    const errorMessage = !customThemeName
      ? localizer('CP.CustomThemeNameErrorRequired')
      : this.allThemeNames.includes(customThemeName)
        ? localizer('CP.CustomThemeNameErrorDuplicate')
        : null;

    if (errorMessage) {
      Dialog.prompt({
        title: localizer('CP.ValidationError'),
        content: errorMessage,
      });
    } else {
      const themeSettings = game.settings.get('cortexprime', 'themes');

      const newCustomThemes = {
        ...themeSettings.customList,
        [customThemeName]: { ...this.currentSettings },
      };

      themeSettings.customList = newCustomThemes;
      this.customThemes = newCustomThemes;

      themeSettings.selectedTheme = customThemeName;
      this.selectedTheme = customThemeName;

      await game.settings.set('cortexprime', 'themes', themeSettings);

      await this.render(true);

      setThemeProperties(this.currentSettings);

      game.socket.emit('system.cortexprime', {
        type: 'setThemeProperties',
      });
    }
  }

  async deleteTheme() {
    if (this.isPresetTheme) {
      Dialog.prompt({
        title: localizer('CP.ValidationError'),
        content: localizer('CP.ThemeDeleteErrorPreset'),
      });

      return
    }

    const confirmed = await Dialog.confirm({
      title: localizer('CP.DeleteThemeConfirmTitle'),
      content: localizer('CP.DeleteThemeConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      const themeSettings = game.settings.get('cortexprime', 'themes');

      delete themeSettings.customList[this.selectedTheme];

      delete this.customThemes[this.selectedTheme];

      themeSettings.selectedTheme = 'Cortex Prime';

      this.selectedTheme = 'Cortex Prime';

      await game.settings.set('cortexprime', 'themes', themeSettings);

      await this.render(true);

      setThemeProperties(this.currentSettings);

      game.socket.emit('system.cortexprime', {
        type: 'setThemeProperties',
      });
    }
  }

  async onChangeTheme(event) {
    const $currentTarget = event.currentTarget;
    const confirmed = !this.isPresetTheme
      ? await Dialog.confirm({
        title: localizer('CP.ChangeThemeConfirmTitle'),
        content: localizer('CP.ChangeThemeConfirmContent'),
        defaultYes: false,
      })
      : true;

    if (confirmed) {
      this.selectedTheme = $currentTarget.value;

      await this.render(true);
    }
  }

  onColorChange(event) {
    const $input = event.target;
    const $fieldColor = $input.closest('.field-color');

    const $swatch = $fieldColor
      .querySelector('.swatch');

    const value = $input.value;

    $swatch.style.backgroundColor = value || '#ffffff';

    const hasTransparentClass = $swatch.classList.contains('transparent');

    if (
      (value && hasTransparentClass)
      || (!value && !hasTransparentClass)
    ) {
      $swatch.classList.toggle('transparent');
    }
  }

  async onDisplayToggle(event) {
    const { section } = event.currentTarget.dataset;

    this.expandedSections = this.expandedSections.includes(section)
      ? this.expandedSections
        .filter(expandedSection => expandedSection !== section)
      : [...this.expandedSections, section];

    displayToggleMethod(event);
  }

  onImageChange(event) {
    const value = event.target.value;

    const $fieldWrapper = event
      .target
      .closest('.field-wrapper');

    const $imageRemove = $fieldWrapper
      .querySelector('.image-remove');

    const $noImageMsg = $fieldWrapper
      .querySelector('.no-image-msg');

    const $fieldImageValue = $fieldWrapper
      .querySelector('.field-img-value');

    $fieldWrapper
      .querySelector('.field-hidden-image-picker')
      .value = value;

    $fieldWrapper
      .querySelector('.field-img')
      .style
      .backgroundImage = value ? `url('${value}')` : '';

    if (value) {
      $imageRemove.classList.remove('hide');

      $noImageMsg.classList.add('hide');

      $fieldImageValue.title = value;
    } else {
      $imageRemove.classList.add('hide');

      $noImageMsg.classList.remove('hide');
    }

    $fieldImageValue.textContent = value || localizer('CP.NoImage');
  }

  preview(html) {
    const formData = Object.fromEntries(new FormData(html[0]).entries());

    const expandedData = foundry.utils.expandObject(formData);

    Log$4('CpThemeSettings.preview expandedData:', expandedData);

    const {
      selectedTheme,
      currentSettings,
    } = expandedData;

    setThemeProperties(
      presetThemes[selectedTheme] ?? currentSettings
    );
  }

  removeImage(event) {
    const $fieldWrapper = event
      .target
      .closest('.field-wrapper');

    $fieldWrapper
      .querySelector('.field-img')
      .style.backgroundImage = null;

    $fieldWrapper
      .querySelector('.field-hidden-image-picker')
      .value = '';

    $fieldWrapper
      .querySelector('.image-remove')
      .classList
      .add('hide');

    $fieldWrapper
      .querySelector('.no-image-msg')
      .classList
      .remove('hide');

    $fieldWrapper
      .querySelector('.field-img-value')
      .textContent = localizer('CP.NoImage');
  }

  async reset() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.ResetConfirmTitle'),
      content: localizer('CP.ResetConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      const themeSettings = game.settings.get('cortexprime', 'themes');

      this.selectedTheme = themeSettings.selectedTheme;

      setThemeProperties();
      this.render(true);
    }
  }

  async save(expandedData) {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.SaveConfirmTitle'),
      content: localizer('CP.SaveConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      const themeSettings = game.settings.get('cortexprime', 'themes');

      const newThemeSettings = foundry.utils.mergeObject(themeSettings, expandedData);

      this.selectedTheme = expandedData.selectedTheme;

      if (!presetThemes[expandedData.selectedTheme]) {
        const customThemeSettings = foundry.utils
          .mergeObject(newThemeSettings.customList[this.selectedTheme], expandedData.currentSettings);
        this.customThemes[this.selectedTheme] = customThemeSettings;
        newThemeSettings.customList[this.selectedTheme] = customThemeSettings;
      }

      Log$4('CpThemeSettings.save newThemeSettings', newThemeSettings);

      await game.settings.set('cortexprime', 'themes', newThemeSettings);

      await this.render(true);

      setThemeProperties(this.currentSettings);

      game.socket.emit('system.cortexprime', {
        type: 'setThemeProperties',
      });

      Dialog.prompt({
        title: localizer('CP.PromptSettingsSaveTitle'),
        content: localizer('CP.PromptSettingsSaveContent'),
      });
    }
  }
}

const Log$3 = Logger();

class CpItemSettings extends FormApplication {
  constructor() {
    super();

    const traitSettings = game.settings.get('cortexprime', 'itemTypes');

    this.traitSettings = traitSettings;

    Log$3('CpItemSettings.constructor traitSettings', traitSettings);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'settings', 'item-settings'],
      closeOnSubmit: false,
      height: 900,
      id: 'ItemSettings',
      left: 400,
      resizable: false,
      scrollY: ['#ItemSettings-form-body'],
      submitOnChange: false,
      submitOnClose: false,
      template: 'systems/cortexprime/system/templates/CpItemSettings.html',
      title: localizer('CP.ItemSettings'),
      top: 200,
      width: 600,
    })
  }

  getData() {
    const data = this.traitSettings;

    Log$3('CPItemSettings.getData data:', data);

    return data
  }

  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);

    Log$3('CPItemSettings._updateSettings expandedData:', expandedData);

    await this.save(event.target, expandedData);
  }

  activateListeners(html) {
    super.activateListeners(html);
    const [$html] = html;

    dragSort($html, this._onDragSortDrop.bind(this, $html));

    diceSelectListener(
      $html,
      {
        changeDie: this.onChangeDie.bind(this),
      }
    );

    checkboxDisplayToggle($html);

    displayToggle($html);

    addListeners(
      $html,
      '#ItemSettings-main',
      'click',
      event => {
        const $goToPage = event.target.closest('.go-to-page');

        if ($goToPage) {
          this.goToPage(event, $html, $goToPage);

        }
      }
    );

    addListeners(
      $html,
      '#ItemSettings-pages-container',
      'change',
      event => {
        const $rollsSeparatelyField = event
          .target
          .closest('.input-rolls-separately')
          ?.querySelector('.field-checkbox-input');

        if ($rollsSeparatelyField) {
          this.onChangeRollsSeparately(event, $rollsSeparatelyField);

        }
      }
    );

    addListeners(
      $html,
      '#ItemSettings-pages-container',
      'click',
      event => {
        const $addDescriptor = event.target.closest('.add-descriptor');

        if ($addDescriptor) {
          this.addDescriptor($html, event, $addDescriptor);
          return
        }

        const $deleteDescriptor = event.target.closest('.delete-descriptor');

        if ($deleteDescriptor) {
          this.deleteDescriptor($deleteDescriptor);

        }
      }
    );

    addListeners(
      $html,
      '.subtraits-list-section',
      'click',
      event => {
        const $addSubtrait = event.target.closest('.add-subtrait');

        if ($addSubtrait) {
          this.addSubtrait($html, $addSubtrait);
          return
        }

        const $duplicateSubtrait = event.target.closest('.duplicate-subtrait');

        if ($duplicateSubtrait) {
          this.duplicateSubtrait($html, $duplicateSubtrait);
          return
        }

        const $deleteSubtrait = event.target.closest('.delete-subtrait');

        if ($deleteSubtrait) {
          this.deleteSubtrait($html, $deleteSubtrait);

        }
      }
    );

    addListeners(
      $html,
      '.subtrait-pages',
      'change',
      event => {
        const $subtraitName = event
          .target
          .closest('.ItemSettings-subtrait-field-name-input');

        if ($subtraitName) {
          this.updateSubtraitName($html, $subtraitName);

        }
      }
    );

    addListeners(
      $html,
      '.traits-list-section',
      'click',
      event => {
        const $addTrait = event.target.closest('.add-trait');

        if ($addTrait) {
          this.addTrait($html, $addTrait);
          return
        }

        const $duplicateTrait = event.target.closest('.duplicate-trait');

        if ($duplicateTrait) {
          this.duplicateTrait($html, $duplicateTrait);
          return
        }

        const $deleteTrait = event.target.closest('.delete-trait');

        if ($deleteTrait) {
          this.deletePageItem($html, $deleteTrait, '.traits-list-item');

        }
      }
    );

    addListeners(
      $html,
      '.trait-pages',
      'change',
      event => {
        const $traitName = event
          .target
          .closest('.ItemSettings-trait-field-name-input');

        if ($traitName) {
          this.updateTraitName($html, $traitName);

        }
      }
    );

    $html
      .querySelector('.settings-reset')
      .addEventListener('click', this.reset.bind(this));
  }

  async addDescriptor($html, event, $addDescriptor) {
    const descriptor = { label: 'New Descriptor' };
    const { path } = $addDescriptor.dataset;
    const sequence = $addDescriptor
      .closest('.item-list')
      .querySelectorAll('.descriptors-list-item')
      .length;

    const content = await renderTemplate(
      'systems/cortexprime/system/templates/partials/ItemSettings/Descriptor.html',
      {
        descriptor,
        path,
        sequence,
      }
    );

    const $list = $addDescriptor
      .closest('.item-list')
      .querySelector('.descriptors-list');

    $list
      .insertAdjacentHTML('beforeend', content);

    const $dragSortHandler = $list
      .querySelector(`.descriptors-list-item[data-sort-sequence="${sequence}"] .drag-sort-handle`);

    addDragSort($dragSortHandler, () => this._onDragSortDrop($html, $list));
  }

  async addSubtrait($html, $addSubtrait) {
    const id = uuid();

    await this._addPageItem(
      $html,
      $addSubtrait,
      {
        id,
        itemsPath: 'subtraits',
        itemName: 'New Subtrait',
        listTypePlural: 'subtraits',
        listTypeSingular: 'subtrait',
        templatePath: 'ItemSettings/SubtraitPage.html',
        templateData: {
          subtrait: {
            id,
            allowMultipleDice: false,
            allowNoDice: false,
            hasConsumableDice: false,
            hasDescription: false,
            hasDice: true,
            hasHitches: true,
            hasLabel: false,
            hasTags: false,
            isRolledSeparately: false,
            isUnlockable: false,
            maxDieRating: 12,
            minDieRating: 4,
            name: 'New Subtrait',
          },
        },
      }
    );

    await this._appendSubtraitType($html, {
      subtraitId: id,
      label: 'New Subtrait',
    });
  }

  async addTrait($html, $addTrait) {
    const id = uuid();

    const subtraits = Array.from(
      $html.querySelectorAll('.subtraits-list-item')
    )
      .map($subTrait => ({
        id: $subTrait.dataset.id,
        name: $subTrait.dataset.name,
      }));

    await this._addPageItem(
      $html,
      $addTrait,
      {
        id,
        itemName: 'New Trait',
        itemsPath: 'traits',
        listTypePlural: 'traits',
        listTypeSingular: 'trait',
        templatePath: 'ItemSettings/TraitPage.html',
        templateData: {
          subtraits,
          trait: {
            id,
            allowMultipleDice: false,
            allowNoDice: false,
            hasConsumableDice: false,
            hasDescription: false,
            hasDice: true,
            hasHitches: true,
            hasLabel: false,
            hasTags: false,
            isRolledSeparately: false,
            isUnlockable: false,
            maxDieRating: 12,
            minDieRating: 4,
            name: 'New Trait',
            subtraitTypes: [],
          },
        },
      }
    );

    this._switchPage($html, { targetId: id });
  }

  async close() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.CloseConfirmTitle'),
      content: localizer('CP.CloseConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      return super.close()
    }
  }

  async deleteDescriptor($deleteDescriptor) {
    const $descriptorsList = $deleteDescriptor
      .closest('.descriptors-list');

    $deleteDescriptor
      .closest('.descriptors-list-item')
      .remove();

    $descriptorsList
      .querySelectorAll('.descriptors-list-item')
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index;
      });
  }

  async deletePageItem($html, $deletePage, parentSelector) {
    const $parentListItem = $deletePage.closest(parentSelector);

    const { id } = $parentListItem.dataset;
    const $dragSortList = $parentListItem.closest('.drag-sort-list');

    const listItemName = $parentListItem
      .querySelector('.list-item-name')
      .textContent;

    const confirmed = await Dialog.confirm({
      title: localizer('CP.DeleteConfirmTitle'),
      content: `${localizer('CP.DeleteConfirmContentStart')} ${listItemName}?`,
      defaultYes: false,
    });

    if (confirmed) {
      $parentListItem.remove();

      $html
        .querySelector(`.ItemSettings-page[data-id="${id}"]`)
        .remove();

      this._reapplySortSequence($html, $dragSortList);
    }

    return confirmed
  }

  async deleteSubtrait($html, $deleteSubtrait) {
    const { id } = $deleteSubtrait
      .closest('.subtraits-list-item')
      .dataset;

    const deleted = await this.deletePageItem($html, $deleteSubtrait, '.subtraits-list-item');

    if (deleted) {
      $html
        .querySelectorAll(`.ItemSettings-subtrait-types [data-subtrait-id="${id}"]`)
        .forEach($subtraitTypeCheckbox => {
          $subtraitTypeCheckbox
            .closest('.ItemSettings-trait-field-subtrait-types')
            .remove();
        });
    }
  }

  async duplicateSubtrait($html, $duplicateSubtrait) {
    const id = uuid();

    const { id: currentId } = $duplicateSubtrait
      .closest('.subtraits-list-item')
      .dataset;

    const $currentSubtraitPage = $html
      .querySelector(`.ItemSettings-page[data-id="${currentId}"]`);

    const name = `${$currentSubtraitPage
      ?.querySelector(`[name="subtraits.${currentId}.name"]`)
      ?.value ?? 'New Subtrait'
    } (duplicate)`;

    await this._addPageItem(
      $html,
      $duplicateSubtrait,
      {
        id,
        itemName: name,
        itemsPath: 'subtraits',
        listTypePlural: 'subtraits',
        listTypeSingular: 'subtrait',
        templatePath: 'ItemSettings/SubtraitPage.html',
        templateData: {
          subtrait: {
            id,
            allowMultipleDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.allowMultipleDice"]`)
              ?.checked ?? false,
            allowNoDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.allowNoDice"]`)
              ?.checked ?? false,
            hasConsumableDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasConsumableDice"]`)
              ?.checked ?? false,
            hasDescription: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasDescription"]`)
              ?.checked ?? false,
            hasDice: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasDice"]`)
              ?.checked ?? false,
            hasHitches: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasHitches"]`)
              ?.checked ?? false,
            hasLabel: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasLabel"]`)
              ?.checked ?? false,
            hasTags: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.hasTags"]`)
              ?.checked ?? false,
            isRolledSeparately: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.isRolledSeparately"]`)
              ?.checked ?? false,
            isUnlockable: $currentSubtraitPage
              ?.querySelector(`[name="subtraits.${currentId}.isUnlockable"]`)
              ?.checked ?? false,
            maxDieRating: parseInt(
              $currentSubtraitPage
                ?.querySelector(`[name="subtraits.${currentId}.maxDieRating"]`)
                ?.value ?? null
              , 10) || null,
            minDieRating: parseInt(
              $currentSubtraitPage
                ?.querySelector(`[name="subtraits.${currentId}.minDieRating"]`)
                ?.value ?? null
              , 10) || null,
            name,
          },
        },
      }
    );

    await this._appendSubtraitType($html, {
      label: name,
      subtraitId: id,
    });

    this._switchPage($html, { targetId: id });
  }

  async duplicateTrait($html, $duplicateTrait) {
    const id = uuid();

    const { id: currentId } = $duplicateTrait
      .closest('.traits-list-item')
      .dataset;

    const $currentTraitPage = $html
      .querySelector(`.ItemSettings-page[data-id="${currentId}"]`);

    const name = `${$currentTraitPage
      ?.querySelector(`[name="traits.${currentId}.name"]`)
      ?.value ?? 'New Trait'
    } (duplicate)`;

    const subtraits = Array.from(
      $html.querySelectorAll('.subtraits-list-item')
    )
      .map($subTrait => ({
        id: $subTrait.dataset.id,
        name: $subTrait.dataset.name,
      }));

    await this._addPageItem(
      $html,
      $duplicateTrait,
      {
        id,
        itemName: name,
        itemsPath: 'traits',
        listTypePlural: 'traits',
        listTypeSingular: 'trait',
        templatePath: 'ItemSettings/TraitPage.html',
        templateData: {
          subtraits,
          trait: {
            id,
            allowMultipleDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.allowMultipleDice"]`)
              ?.checked ?? false,
            allowNoDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.allowNoDice"]`)
              ?.checked ?? false,
            hasConsumableDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasConsumableDice"]`)
              ?.checked ?? false,
            hasDescription: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasDescription"]`)
              ?.checked ?? false,
            hasDice: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasDice"]`)
              ?.checked ?? false,
            hasHitches: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasHitches"]`)
              ?.checked ?? false,
            hasLabel: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasLabel"]`)
              ?.checked ?? false,
            hasTags: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.hasTags"]`)
              ?.checked ?? false,
            isRolledSeparately: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.isRolledSeparately"]`)
              ?.checked ?? false,
            isUnlockable: $currentTraitPage
              ?.querySelector(`[name="traits.${currentId}.isUnlockable"]`)
              ?.checked ?? false,
            maxDieRating: parseInt(
              $currentTraitPage
                ?.querySelector(`[name="traits.${currentId}.maxDieRating"]`)
                ?.value ?? null
              , 10) || null,
            minDieRating: parseInt(
              $currentTraitPage
                ?.querySelector(`[name="traits.${currentId}.minDieRating"]`)
                ?.value ?? null
              , 10) || null,
            name,
            subtraitTypes: Array.from(
              $currentTraitPage
                ?.querySelectorAll(`[name="traits.${currentId}.subtraitTypes"]:checked`)
            )
              .map($subtraitType => $subtraitType.value),
          },
        },
      }
    );

    this._switchPage($html, { targetId: id });
  }

  async goToPage(event, $html, $goToPage) {
    const {
      currentId,
      targetId,
    } = $goToPage?.dataset ?? event.currentTarget.dataset;

    this._switchPage($html, { currentId, targetId });
  }

  async onChangeDie(event, { index, value }) {
    const $diceSelect = event.target.closest('.dice-select');
    const $dieWrapper = event.target.closest('.die-wrapper');
    const $dieSelect = $dieWrapper.querySelector('.die-select');

    $diceSelect
      .querySelector('.cp-die')
      .outerHTML = getDieIcon(value);

    $dieSelect.value = value;

    const $listItemPage = $diceSelect.closest('.list-item-page');
    const $maxDieRating = $listItemPage.querySelector('.max-die-rating');
    const $minDieRating = $listItemPage.querySelector('.min-die-rating');

    if (
      $diceSelect.classList.contains('min-die-rating')
      && parseInt(value, 10) > parseInt($maxDieRating.querySelector('.die-select').value, 10)
    ) {
      $maxDieRating.value = value;

      $maxDieRating
        .querySelector('.cp-die')
        .outerHTML = getDieIcon(value);

      $maxDieRating
        .querySelector('.die-select')
        .value = value;
    } else if (
      $diceSelect.classList.contains('max-die-rating')
      && parseInt(value, 10) < parseInt($minDieRating.querySelector('.die-select').value, 10)
    ) {
      $minDieRating.value = value;

      $minDieRating
        .querySelector('.cp-die')
        .outerHTML = getDieIcon(value);

      $minDieRating
        .querySelector('.die-select')
        .value = value;
    }
  }

  async onChangeRollsSeparately(event, $rollsSeparatelyField) {
    const isChecked = $rollsSeparatelyField.checked;

    const $hasHitchesField = $rollsSeparatelyField
      .closest('.ItemSettings-page')
      .querySelector('.input-has-hitches .field-checkbox-input');

    $hasHitchesField.checked = !isChecked;
    $hasHitchesField.disabled = !isChecked;

    $hasHitchesField
      .closest('.field')
      .classList
      .toggle('field-disabled', !isChecked);
  }

  async reset() {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.ResetConfirmTitle'),
      content: localizer('CP.ResetConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      this.render(true);
    }
  }

  async save($html, expandedData) {
    const confirmed = await Dialog.confirm({
      title: localizer('CP.SaveConfirmTitle'),
      content: localizer('CP.SaveConfirmContent'),
      defaultYes: false,
    });

    if (confirmed) {
      const sequenceSort = ([_, aValue], [__, bValue]) => {
        const aSortValue = parseInt(aValue.sequence, 10);
        const bSortValue = parseInt(bValue.sequence, 10);

        return bSortValue > aSortValue.sequence
          ? -1
          : aSortValue > bSortValue
            ? 1
            : 0
      };

      const subtraits = objectSortToArray(expandedData.subtraits, sequenceSort)
        .map(subtrait => {
          delete subtrait.sequence;

          subtrait.descriptors = Array.from(
            $html
              .querySelectorAll(`.subtrait-page[data-id="${subtrait.id}"] .descriptors-list-item`)
          )
            .map($listItem => {
              return {
                label: $listItem
                  .querySelector('.ItemSettings-descriptor-field-name-input')
                  .value,
              }
            });

          subtrait.maxDieRating = parseInt(subtrait.maxDieRating, 10);
          subtrait.minDieRating = parseInt(subtrait.minDieRating, 10);

          return subtrait
        });

      const traits = objectSortToArray(expandedData.traits, sequenceSort)
        .map(trait => {
          delete trait.sequence;

          trait.descriptors = Array.from(
            $html
              .querySelectorAll(`.trait-page[data-id="${trait.id}"] .descriptors-list-item`)
          )
            .map($listItem => {
              return {
                label: $listItem
                  .querySelector('.ItemSettings-descriptor-field-name-input')
                  .value,
              }
            });

          trait.maxDieRating = parseInt(trait.maxDieRating, 10);
          trait.minDieRating = parseInt(trait.minDieRating, 10);
          trait.subtraitTypes = trait.subtraitTypes.filter(x => x);

          return trait
        });

      const serializedData = {
        subtraits,
        traits,
      };

      Log$3('CpItemSettings.save serializedData', serializedData);

      game.settings.set('cortexprime', 'itemTypes', serializedData);

      Dialog.prompt({
        title: localizer('CP.PromptSettingsSaveTitle'),
        content: localizer('CP.PromptSettingsSaveContent'),
      });
    }
  }

  updateSubtraitName($html, $subtraitName) {
    const $subtraitPage = $subtraitName.closest('.subtrait-page');

    const { id } = $subtraitPage.dataset;

    const subtraitName = $subtraitName.value;

    $subtraitPage
      .querySelector('.subtrait-page-name')
      .textContent = subtraitName;

    $html
      .querySelector(`.subtraits-list-item[data-id="${id}"] .subtraits-list-item-name`)
      .textContent = subtraitName;

    $html
      .querySelectorAll(`.ItemSettings-trait-field-subtrait-types [data-subtrait-id="${id}"]`)
      .forEach($subtraitType => {
        $subtraitType
          .closest('.field-wrapper')
          .querySelector('.field-label')
          .textContent = subtraitName;
      });
  }

  updateTraitName($html, $traitName) {
    const $traitPage = $traitName.closest('.trait-page');

    const { id } = $traitPage.dataset;

    const traitName = $traitName.value;

    $traitPage
      .querySelector('.trait-page-name')
      .textContent = traitName;

    $html
      .querySelector(`.traits-list-item[data-id="${id}"] .traits-list-item-name`)
      .textContent = traitName;
  }

  async _addPageItem($html, $addListButton, payload) {
    const {
      id,
      itemName,
      itemsPath,
      listTypePlural,
      listTypeSingular,
      templatePath,
      templateData,
    } = payload;

    const $list = $addListButton
      .closest(`.${listTypePlural}-list-section`)
      .querySelector(`.${listTypePlural}-list`);

    const $listItems = $list
      .querySelectorAll(`.${listTypePlural}-list-item`);

    const sequence = $listItems.length;

    const listItemHtml = await renderTemplate(
      'systems/cortexprime/system/templates/partials/SortableListItem.html',
      {
        itemIndex: sequence,
        itemsPath: itemsPath,
        pluralClassAffix: listTypePlural,
        singularClassAffix: listTypeSingular,
        item: {
          id,
          name: itemName,
          sequence: sequence,
        },
      }
    );

    $list.insertAdjacentHTML('beforeend', listItemHtml);

    const $newListItem = $list
      .querySelector(`.${listTypePlural}-list-item[data-sort-sequence="${sequence}"]`);

    const $dragSortHandler = $newListItem
      .querySelector('.drag-sort-handle');

    addDragSort($dragSortHandler, () => this._onDragSortDrop($html, $list));

    const pageHtml = await renderTemplate(
      `systems/cortexprime/system/templates/partials/${templatePath}`,
      templateData
    );

    $html
      .querySelector(`.${listTypeSingular}-pages`)
      .insertAdjacentHTML('beforeend', pageHtml);

    this._switchPage($html, { targetId: id });
  }

  async _appendSubtraitType($html, data) {
    const $traitPages = $html
      .querySelectorAll('.trait-page');

    await Promise.all(
      Array.from($traitPages)
        .map(async $traitPage => {
          const { id: traitId } = $traitPage.dataset;

          const subtraitTypeHtml = await renderTemplate(
            'systems/cortexprime/system/templates/partials/ItemSettings/SubtraitType.html',
            {
              checked: false,
              subtraitId: data.subtraitId,
              trait: traitId,
              label: data.label,
            }
          );

          $traitPage
            .querySelector('.ItemSettings-subtrait-types')
            .insertAdjacentHTML('beforeend', subtraitTypeHtml);
        })
    );
  }

  _onDragSortDrop($html, $dragSortList) {
    this._reapplySortSequence($html, $dragSortList);
  }

  _reapplySortSequence($html, $dragSortList) {
    const { sortList } = $dragSortList.dataset;

    Array.from($dragSortList.children)
      .forEach(($item, index) => {
        $item.dataset.sortSequence = index;
        const $dragSortItemSequence = $item
          .querySelector('.drag-sort-item-sequence');

        if ($dragSortItemSequence) {
          $dragSortItemSequence.value = index;
        }

        if (sortList === 'subtraits') {
          $html
            .querySelectorAll('.ItemSettings-subtrait-types')
            .forEach($subtraitSection => {
              const $subtraitType = $subtraitSection
                .querySelector(`[data-subtrait-id="${$item.dataset.id}"]`)
                .closest('.ItemSettings-trait-field-subtrait-types');

              $subtraitSection.append($subtraitType);
            });
        }
      });
  }

  _switchPage($html, { currentId, targetId }) {
    $html
      .querySelector(currentId ? `.ItemSettings-page[data-id="${currentId}"]` : '.list-page')
      .classList
      .add('hide');

    $html
      .querySelector(targetId ? `.ItemSettings-page[data-id="${targetId}"]` : '.list-page')
      .classList
      .remove('hide');
  }
}

/** Theme Settings ***/
// feat(0.3.0): Add temporary die
// feat(0.3.0): Add a heading 3 and apply to "Preset Descriptors" in Item Settings

/** * Dice Pool ***/
// feat(1.0.0): preview button in DicePool to preview pool prior to rolling
// // Use sockets to update and have a dropdown to choose which dice pool to view

/** * Item Settings ***/
// tweak(0.3.0): (FUTURE) when deleting trait or subtrait other sheets will be properly updated
// tweak(0.3.0): Type image & update in item list

/** * Item Sheets ***/
// feat(0.3.0): getter for item type and selector (different message if missing item type rather than unchosen)
// feat(0.3.0): Drag & Drop subtrait items onto trait item sheets
// feat(0.3.0): Editing subtrait on a trait sheet will open a subtrait sheet

/** * Actor Settings ***/
// feat(0.3.0): Create settings page
// feat(0.3.0): Layout options
// feat(0.3.0): "Simple Traits" for dice, booleans and/or tags?, numbers, text, etc.
// feat(1.0.0): Growth Tracking

/** * Actor Sheets ***/
// feat: temporary dice ratings
// feat(0.3.0): Drag and Drop trait and subtrait items onto sheets

/** * Misc Settings ***/
// feat(0.3.0): expandable roll result traits setting (default not)

/** * Misc ***/
// feat(0.3.0): textarea icon interpolation
// feat: Turn Order
// feat(1.0.0): Quick access sheet
// feat(0.3.0): Help Document/page

var defaultActorTypes = {
  actorTypes: [
    {
      id: 'character',
      name: 'Character',
    },
    {
      id: 'scene',
      name: 'Scene',
    },
  ],
};

var defaultItemTypes = {
  subtraits: [
    {
      id: 'subtrait-power',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 6,
      name: 'Power',
    },
    {
      id: 'subtrait-sfx',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: true,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'SFX',
    },
    {
      id: 'subtrait-specialty',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 6,
      minDieRating: 6,
      name: 'Specialty',
    },
    {
      id: 'subtrait-specialty-split',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 8,
      name: 'Specialty (Split)',
    },
    {
      id: 'subtrait-stress',
      allowMultipleDice: false,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Stress',
    },
    {
      id: 'subtrait-trait-statement',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Trait Statement',
    },
    {
      id: 'subtrait-trauma',
      allowMultipleDice: false,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Trauma',
      subtraitTypes: [],
    },
  ],
  traits: [
    {
      id: 'trait-ability',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: true,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 6,
      name: 'Ability',
      subtraitTypes: [
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-affiliation',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 10,
      minDieRating: 6,
      name: 'Affiliation',
      subtraitTypes: [],
    },
    {
      id: 'trait-asset',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Asset',
      subtraitTypes: [],
    },
    {
      id: 'trait-attribute',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Attribute',
      subtraitTypes: [],
    },
    {
      id: 'trait-complication',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Complication',
      subtraitTypes: [],
    },
    {
      id: 'trait-distinction',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 8,
      minDieRating: 8,
      name: 'Distinction',
      subtraitTypes: [
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-hero-dice',
      allowMultipleDice: true,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: true,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Hero Dice',
      subtraitTypes: [],
    },
    {
      id: 'trait-pool',
      allowMultipleDice: true,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Pool',
      subtraitTypes: [],
    },
    {
      id: 'trait-power-set',
      allowMultipleDice: true,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Power Set',
      subtraitTypes: [
        'subtrait-power',
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-relationship',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Relationship',
      subtraitTypes: [],
    },
    {
      id: 'trait-reputation',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: true,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Reputation',
      subtraitTypes: [
        'subtrait-trait-statement',
      ],
    },
    {
      id: 'trait-resource',
      allowMultipleDice: true,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: true,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: false,
      hasLabel: false,
      hasTags: true,
      isRolledSeparately: true,
      isUnlockable: false,
      maxDieRating: 6,
      minDieRating: 6,
      name: 'Resource',
      subtraitTypes: [],
    },
    {
      id: 'trait-role',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Role',
      subtraitTypes: [],
    },
    {
      id: 'trait-signature-asset',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Signature Asset',
      subtraitTypes: [
        'subtrait-sfx',
      ],
    },
    {
      id: 'trait-skill-split',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 6,
      minDieRating: 4,
      name: 'Skill (Split)',
      subtraitTypes: [
        'subtrait-specialty-split',
      ],
    },
    {
      id: 'trait-skill',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Skill',
      subtraitTypes: [
        'subtrait-specialty',
      ],
    },
    {
      id: 'trait-specialty',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 8,
      name: 'Specialty',
      subtraitTypes: [],
    },
    {
      id: 'trait-stress',
      allowMultipleDice: false,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Stress',
      subtraitTypes: [],
    },
    {
      id: 'trait-stress-and-trauma',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Stress/Trauma',
      subtraitTypes: [
        'subtrait-stress',
        'subtrait-trauma',
      ],
    },
    {
      id: 'trait-talent',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [
        { label: 'Trigger' },
        { label: 'Effect' },
      ],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: true,
      hasDice: false,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Talent',
      subtraitTypes: [],
    },
    {
      id: 'trait-trauma',
      allowMultipleDice: false,
      allowNoDice: true,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: false,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Trauma',
      subtraitTypes: [],
    },
    {
      id: 'trait-value',
      allowMultipleDice: false,
      allowNoDice: false,
      descriptors: [],
      hasConsumableDice: false,
      hasDescription: true,
      hasDescriptors: false,
      hasDice: true,
      hasHitches: true,
      hasLabel: false,
      hasTags: false,
      isRolledSeparately: false,
      isUnlockable: false,
      maxDieRating: 12,
      minDieRating: 4,
      name: 'Value',
      subtraitTypes: [
        'subtrait-trait-statement',
      ],
    },
  ],
};

var defaultThemes = {
  selectedTheme: 'Cortex Prime',
  customList: {},
};

const registerSettings = () => {
  game.settings.register('cortexprime', 'actorTypes', {
    config: false,
    default: defaultActorTypes,
    name: localizer('CP.ActorTypes'),
    scope: 'world',
    type: Object,
  });

  game.settings.registerMenu('cortexprime', 'ActorSettings', {
    hint: localizer('CP.ActorSettingsHint'),
    icon: 'fas fa-person',
    label: localizer('CP.ActorSettings'),
    name: localizer('CP.ActorSettings'),
    restricted: true,
    type: CpActorSettings,
  });

  game.settings.register('cortexprime', 'itemTypes', {
    config: false,
    default: defaultItemTypes,
    name: localizer('CP.ItemTypes'),
    scope: 'world',
    type: Object,
  });

  game.settings.registerMenu('cortexprime', 'ItemSettings', {
    hint: localizer('CP.ItemSettingsHint'),
    icon: 'fas fa-sack',
    label: localizer('CP.ItemSettings'),
    name: localizer('CP.ItemSettings'),
    restricted: true,
    type: CpItemSettings,
  });

  game.settings.register('cortexprime', 'themes', {
    name: localizer('Themes'),
    default: defaultThemes,
    scope: 'world',
    type: Object,
    config: false,
  });

  game.settings.registerMenu('cortexprime', 'ThemeSettings', {
    hint: localizer('CP.ThemeSettingsHint'),
    icon: 'fas fa-palette',
    label: localizer('CP.ThemeSettings'),
    name: localizer('CP.ThemeSettings'),
    restricted: true,
    type: CpThemeSettings,
  });

};

const Log$2 = Logger();

class CpItemSheet extends ItemSheet {
  itemTypeSettings = game.settings.get('cortexprime', 'itemTypes')

  get item() {
    return super.item
  }

  get itemTypeProperty() {
    return this.item.type === 'Trait'
      ? 'traits'
      : 'subtraits'
  }

  get itemTypeOptions() {
    return this.itemTypeSettings[this.itemTypeProperty]
  }

  get itemSettings() {
    const itemTypeId = this.item.system?.itemTypeId;

    if (!itemTypeId) return null

    return this.itemTypeOptions
      ?.find(({ id }) => id === itemTypeId) ?? null
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'item-sheet'],
      height: 450,
      template: 'systems/cortexprime/system/templates/CpItemSheet.html',
      width: 480,
    })
  }

  async getData(options) {
    const superData = super.getData(options);

    Log$2('CpItemSheet.getData superData:', superData);

    Log$2('CpItemSheet.getData item', this.item);

    Log$2('CpItemSheet.getData itemTypeSettings', this.itemTypeSettings);

    Log$2('CpItemSheet.getData itemSettings', this.itemSettings);

    Log$2('CpItemSheet.getData itemTypeOptions', this.itemTypeOptions);

    if (this.item.system.itemTypeId && !this.itemSettings) ;

    const data = {
      ...superData,
      itemSettings: this.itemSettings,
      itemTypeOptions: [
        { placeholder: true, id: '', name: localizer('CP.ChooseTypeMessage') },
        ...this.itemTypeOptions,
      ],
    };

    Log$2('CpItemSheet.getData data', data);

    return data
  }

  async _updateObject(event, formData) {
    let expandedData = foundry.utils.expandObject(formData);

    Log$2('CPItemSheet._updateObject expandedData:', expandedData);

    const hasItemTypeChanged = expandedData.data.system.itemTypeId
      && expandedData.data.system.itemTypeId !== this.item.system.itemTypeId;

    expandedData.data.system.dice = typeof expandedData.data.system.dice === 'string'
      ? [parseInt(expandedData.data.system.dice, 10)]
      : expandedData.data.system.dice
        ? expandedData.data.system.dice.map(die => parseInt(die, 10))
        : [];

    if (hasItemTypeChanged) {
      expandedData = this.onItemTypeChange(expandedData);
    }

    const system = foundry.utils.mergeObject(this.item.system, expandedData.data.system);

    Log$2('CPItemSheet._updateObject system:', system);

    await this.item.update({
      name: expandedData.data.name || this.item.name,
      system,
    });

    await this.render();
  }

  activateListeners(html) {
    super.activateListeners(html);
    const [$html] = html;

    diceSelectListener(
      $html,
      {
        addDie: this.onAddDie.bind(this),
        removeDie: this.onRemoveDie.bind(this),
      }
    );
  }

  async onAddDie() {
    await this.item.update({
      system: {
        ...this.item.system,
        dice: [
          ...this.item.system.dice ?? [],
          this.item.system.dice?.[this.item.system.dice.length -1] ?? this.itemSettings.minDieRating,
        ],
      },
    });

    this.render(true);
  }

  onItemTypeChange(expandedData) {
    const newItemSettings = this.itemTypeOptions
      ?.find(({ id }) => id === expandedData.data.system.itemTypeId) ?? null;

    const dice = expandedData.data.system.dice;

    if (newItemSettings.hasDice) {
      expandedData.data.system.dice = dice.length > 0
        ? newItemSettings.allowMultipleDice
          ? dice.map(die => {
            return (
              die > newItemSettings.maxDieRating
                  || die < newItemSettings.minDieRating
            )
              ? newItemSettings.minDieRating
              : die
          })
          : (
            dice[0] > newItemSettings.maxDieRating
                || dice[0] < newItemSettings.minDieRating
          )
            ? [newItemSettings.minDieRating]
            : [dice[0]]
        : newItemSettings.allowNoDice
          ? dice
          : [newItemSettings.minDieRating];
    }

    return expandedData
  }

  async onRemoveDie(event, { index }) {
    await this.item.update({
      system: {
        ...this.item.system,
        dice: this.item.system.dice?.filter((_, i) => i !== index),
      },
    });

    this.render(true);
  }

  // TODO: Create a conformToSettings method
  // // Does checks and if not matching it conforms
  // TODO: Create a serializeDice method
  // // Used for submission
}

const Log$1 = Logger();

class CpActorSheet extends ActorSheet {
  get actor() {
    return super.actor
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['cortexprime', 'sheet', 'actor-sheet'],
      height: 900,
      template: 'systems/cortexprime/system/templates/CpActorSheet.html',
      width: 960,
    })
  }

  async getData(options) {
    const superData = super.getData(options);

    Log$1('CpActorSheet.getData superData:', superData);

    return superData
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}

const registerSheets = () => {
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('cortexprime', CpActorSheet, {
    label: localizer('CP.ActorSheetLabel'),
    makeDefault: true,
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('cortexprime', CpItemSheet, {
    label: localizer('CP.ItemSheetLabel'),
    makeDefault: true,
  });
};

const Log = Logger();

Hooks.once('init', () => {
  game.socket.on('system.cortexprime', sockets);

  CONFIG.debug.logs = true;

  Log('Initializing Cortex prime system...');

  CONFIG.Item.documentClass = CpItem;

  game.cortexprime = {};

  registerHandlebarHelpers();
  preloadHandlebarsTemplates();
  registerSettings();
  registerSheets();
  hooks();
});
//# sourceMappingURL=cortexprime.mjs.map
