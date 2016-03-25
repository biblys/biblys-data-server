const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../../index');

chai.should();
chai.use(chaiHttp);

describe('Web', function() {
  it('should display home page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
});
