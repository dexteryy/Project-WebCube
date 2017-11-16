/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('actions', () => {
  it('cancel()', done => {
    let isSuccess = false;
    let isError = false;
    nock(ROOT)
      .get('/delay')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const req = hifetch({
      url: `${ROOT}/delay`,
      success() {
        isSuccess = true;
      },
      error() {
        isError = true;
      },
    });
    const startTime = new Date().getTime();
    function fetchDone() {
      expect(isSuccess).to.be.false;
      expect(isError).to.be.false;
      expect(new Date().getTime() - startTime).to.be.above(300);
      done();
    }
    req
      .send()
      .then(fetchDone)
      .catch(fetchDone);
    setTimeout(() => {
      req.cancel();
    }, 100);
    setTimeout(fetchDone, 300);
  });

  it('error()', done => {
    let isSuccess = false;
    let isError = false;
    nock(ROOT)
      .get('/delay')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const req = hifetch({
      url: `${ROOT}/delay`,
      success() {
        isSuccess = true;
      },
      error(res) {
        isError = true;
        expect(res.status).to.equal(6);
        expect(res.customError).to.be.an('error');
        expect(res.customError.toString()).to.be.include('test');
      },
    });
    const startTime = new Date().getTime();
    function fetchDone() {
      expect(isSuccess).to.be.false;
      expect(isError).to.be.true;
      expect(new Date().getTime() - startTime).to.be.above(300);
      done();
    }
    req
      .send()
      .then(fetchDone)
      .catch(fetchDone);
    setTimeout(() => {
      req.error(new Error('test'));
    }, 100);
    setTimeout(fetchDone, 300);
  });
});
