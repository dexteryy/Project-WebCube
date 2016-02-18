import mochaGenerators from 'mocha-generators';
import chai from 'chai';
import Nightmare from 'nightmare';
// import Chance from 'chance';

const util = require('../../../utils');

mochaGenerators.install();
chai.should();

describe('app', function () {
  this.timeout(60000);
  const rootUrl = util.getUrlRoot();
  const url = `${rootUrl}/app/index.html`;

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
        return document.querySelectorAll('.app').length;
      });
      result.should.equal(1);
    });

    it('should have WelcomeBox', function* () {
      const result = yield nightmare.goto(url).evaluate(function () {
        return document.querySelectorAll('.welcome-box').length;
      });
      result.should.equal(1);
    });

    it('should contain correct text in WelcomeBox', function* () {
      const result = yield nightmare.goto(url).evaluate(function () {
        return document.querySelector('.welcome-box .msg').innerHTML;
      });
      result.should.equal('This is a demo');
    });

  });

});
