'use strict';

const Publisher = require('../../models/publisher.js');

const publisher = new Publisher({
  name: 'Dystopia'
});

describe('Publisher model', function() {

  it('should correctly format a publisher response', function(done) {
    publisher.response.should.be.an('object');
    publisher.response.should.have.property('id');
    publisher.response.should.have.property('name');
    publisher.response.name.should.equal('Dystopia');
    done();
  });

});
