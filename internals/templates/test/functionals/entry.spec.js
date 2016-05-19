import mochaGenerators from 'mocha-generators';
import chai from 'chai';
import Nightmare from 'nightmare';
// import Chance from 'chance';

const util = require('internals/utils');

mochaGenerators.install();
chai.should();

describe('{{entryName}}', function () {
  this.timeout(60000);
  const rootUrl = util.getUrlRoot();
  const url = `${rootUrl}/{{entryName}}/index.html`;

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
        return document.querySelectorAll('#{{camelCase entryName}}Root').length;
      });
      result.should.equal(1);
    });

  });

});
