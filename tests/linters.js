
describe('Linters', function() {
  // JSCS
  require('mocha-jscs')();

  // ESlint
  require('mocha-eslint')([
    'controllers',
    'middlewares',
    'models',
    'tests',
    'index.js'
  ]);
});
