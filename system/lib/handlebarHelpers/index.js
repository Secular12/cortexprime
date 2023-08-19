import diceSelect from './diceSelect.js';
import dieResult from './dieResult.js';
import fieldCheckbox from './fieldCheckbox.js';
import fieldInput from './fieldInput.js';
import fieldSelect from './fieldSelect.js';

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper({
    add: (a, b) => +a + +b,
    get: (list, key) => list[key] ?? false,
    includes: (arr, item) => arr.includes(item),
    length: (value) => value?.length ?? null,
    sub: (a, b) => +a - +b,
    '??': (a, b) => a ?? b,
  }),
  Handlebars.registerHelper('times', (n, block) => {
    let accum = '';
    for(let i = 0; i < n; ++i)
      accum += block.fn(i);
    return accum
  })
  Handlebars.registerHelper('diceSelect', diceSelect)
  Handlebars.registerHelper('dieResult', dieResult)
  Handlebars.registerHelper('fieldNumber', fieldInput('number'))
  Handlebars.registerHelper('fieldCheckbox', fieldCheckbox)
  Handlebars.registerHelper('fieldSelect', fieldSelect)
  Handlebars.registerHelper('fieldText', fieldInput('text'))
}