'use strict';

const Contributor = require('../../models/contributor.js');

const contributor = new Contributor({
  firstName: 'Thomas',
  lastName: 'Ligotti'
});

const contributorWithoutFirstName = new Contributor({
  lastName: 'Voltaire'
});

describe('Contributor model', function() {

  it('should correctly format a full name', function() {
    contributor.name.should.equal('Thomas Ligotti');
  });

  it('should correctly format a full name without a first name', function() {
    contributorWithoutFirstName.name.should.equal('Voltaire');
  });

  it('should correctly format a contributor response', function() {
    contributor.response.should.be.an('object');
    contributor.response.should.have.property('id');
    contributor.response.should.have.property('firstName');
    contributor.response.firstName.should.equal('Thomas');
    contributor.response.should.have.property('lastName');
    contributor.response.lastName.should.equal('Ligotti');
    contributor.response.should.have.property('name');
    contributor.response.name.should.equal('Thomas Ligotti');
  });
});
