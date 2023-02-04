var Logger = (method) => (...args) => {
  if (CONFIG.debug?.logs) {
      if (!method || typeof method === 'string') console[method || 'log'](...args);
      else args.forEach((arg, index) => {
          console[method?.[index] ?? 'log'](arg);
      });
  }
};

Hooks.once('init', () => {
  CONFIG.debug.logs = true;

  game.cortexprime = {};

  Logger()('Initializing Cortex prime system...');
});
//# sourceMappingURL=cortexprime.mjs.map
