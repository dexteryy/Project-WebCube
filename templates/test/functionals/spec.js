import mochaGenerators from 'mocha-generators';
import chai from 'chai';
import Nightmare from 'nightmare';
// import Chance from 'chance';

const util = require('../../../utils');

mochaGenerators.install();
chai.should();

describe('{{entryName}}', function () {
  this.timeout(60000);
  const url = `${util.getUrlRoot()}/{{entryName}}/index.html`;

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
