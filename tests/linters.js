
describe('Linters', function() {
  // JSCS
  require('mocha-jscs')();

  // ESlint
  require('mocha-eslint')(['.']);
});
