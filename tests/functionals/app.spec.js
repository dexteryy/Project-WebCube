import mochaGenerators from 'mocha-generators';
import chai from 'chai';
import Nightmare from 'nightmare';
// import Chance from 'chance';

mochaGenerators.install();
chai.should();

describe('App', () => {
  const myhost = process.env.MYAPP_DEVSERVER_HOST;
  const myport = process.env.MYAPP_DEVSERVER_PORT;
  const url = `http://${myhost}:${myport}/app/`;

  describe('Start page', () => {

    let nightmare;

    beforeEach(function () {
      nightmare = new Nightmare();
    });

    afterEach(function* () {
      yield nightmare.end();
    });

    it('should have WelcomeBox', function* () {
      const result = yield nightmare.goto(url).evaluate(function () {
        return document.querySelectorAll('.welcome').length;
      });
      result.should.equal(1);
    });

    it('should contain correct text in WelcomeBox', function* () {
      const result = yield nightmare.goto(url).evaluate(function () {
        return document.querySelector('.welcome .msg').innerHTML;
      });
      result.should.equal('This is a demo');
    });

  });

});
