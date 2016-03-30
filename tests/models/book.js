'use strict';

const Book        = require('../../models/book.js');
const Contributor = require('../../models/contributor.js');

const book = new Book({
  ean: '9791091146135',
  title: 'Chants du cauchemar et de la nuit',
  publisher: {
    id: '1234',
    name: 'Dystopia'
  },
  createdBy: '123'
});

describe('Book model', function() {

  it('should correctly format an ISBN', function(done) {
    book.isbn.should.equal('979-10-91146-13-5');
    done();
  });

  it('should correctly format a book response', function(done) {
    book.response.should.be.an('object');
    book.response.should.have.property('ean');
    book.response.ean.should.equal('9791091146135');
    book.response.should.have.property('isbn');
    book.response.isbn.should.equal('979-10-91146-13-5');
    book.response.should.have.property('title');
    book.response.title.should.equal('Chants du cauchemar et de la nuit');
    book.response.publisher.should.be.an('object');
    book.response.publisher.should.have.property('id');
    book.response.publisher.should.have.property('name');
    book.response.publisher.name.should.equal('Dystopia');
    done();
  });

  it('should correctly add a contributor', function(done) {

    const contributor = new Contributor({
      firstName: 'Thomas',
      lastName: 'Ligotti'
    });
    book.addContributor(contributor, 'author');

    book.contributors.should.be.an('array');
    book.contributors[0].should.have.property('id');
    book.contributors[0].should.have.property('name');
    book.contributors[0].name.should.equal('Thomas Ligotti');
    book.contributors[0].should.have.property('role');
    book.contributors[0].role.should.equal('author');
    done();
  });
});
