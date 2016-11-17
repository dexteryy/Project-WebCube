
import { expect } from 'chai';
import Nightmare from 'nightmare';
// import Chance from 'chance';
import * as util from 'webcube/utils';

describe('{{entryName}}', function () {

  this.timeout(60000);
  const rootUrl = util.getUrlRoot();
  const url = `${rootUrl}/{{entryName}}/index.html`;

  describe('Start page', function () {

    it('should be mounted', function (done) {
      const nightmare = Nightmare({
        show: false,
      });
      nightmare.goto(url).evaluate(function () {
        return document.querySelectorAll('#{{camelCase entryName}}Root').length;
      }).end().then(result => {
        expect(result).to.be.equal(1);
        done();
      }).catch(done);
    });

  });

});
