
describe('Linters', function() {
  const paths = [
    'controllers',
    'middlewares',
    'models',
    'tests',
    'index.js'
  ];

  // JSCS
  require('mocha-jscs')(paths);

  // ESlint
  require('mocha-eslint')(paths);
});
