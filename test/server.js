var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Web', function() {
  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});

describe('Books', function() {
  it('should list a SINGLE book on GET /api/v0/books/:ean');
  it('should add a SINGLE book on POST /api/v0/books/');
  it('should update a SINGLE book on PUT /api/v0/books/:ean');
  it('should delete a SINGLE book on DELETE /api/v0/books/:ean');
});
