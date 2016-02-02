import mochaGenerators from 'mocha-generators';
import chai from 'chai';
import Nightmare from 'nightmare';
// import Chance from 'chance';

mochaGenerators.install();
chai.should();

describe('{{entryName}}', function () {
  this.timeout(5000);
  const myhost = process.env.MYAPP_SERVER_HOST;
  const myport = process.env.MYAPP_SERVER_PORT;
  const url = `http://${myhost}:${myport}/{{entryName}}/`;

  describe('Start page', function () {

    let nightmare;

    beforeEach(function () {
      nightmare = new Nightmare();
    });

    afterEach(function* () {
      yield nightmare.end();
    });

    it('should be mounted', function* () {
      const result = yield nightmare.goto(url).evaluate(function () {
        return document.querySelectorAll('.{{entryName}}').length;
      });
      result.should.equal(1);
    });

  });

});
