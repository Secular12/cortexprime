const localizer = target => game.i18n.localize(target);

var Logger = (method) => (...args) => {
  if (CONFIG.debug?.logs) {
      if (!method || typeof method === 'string') console[method || 'log'](...args);
      else args.forEach((arg, index) => {
          console[method?.[index] ?? 'log'](arg);
      });
  }
};

class DicePool extends FormApplication {
  constructor () {
    super();
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
      width: 360
    })
  }

  getData () {
    const data = {};

    Logger()('DicePool.getData data:', data);

    return data
  }

  _updateObject (event, formData) {
    const expandedData = expandObject(formData);

    Logger()(
      'DicePool._updateObject event, expandedData:',
      event,
      expandedData
    );
  }

  activateListeners (html) {
    super.activateListeners(html);
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
  Hooks.on('renderSceneControls', renderSceneControls);
};

Hooks.once('init', () => {
  CONFIG.debug.logs = true;

  game.cortexprime = {};

  Logger()('Initializing Cortex prime system...');
  hooks();
});
//# sourceMappingURL=cortexprime.mjs.map
