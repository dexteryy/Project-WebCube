/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('error: 5', () => {
  it('timeout, promise style', done => {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error5`,
      timeout: 100,
    };
    const errorHandler = res => {
      expect(res.status).to.equal(5);
      expect(res.timeout).to.equal(100);
      return res;
    };
    hifetch(fetchConfig)
      .send()
      .catch(errorHandler)
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('timeout, callback style', done => {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error5`,
      timeout: 100,
    };
    const errorHandler = res => {
      expect(res.status).to.equal(5);
      expect(res.timeout).to.equal(100);
      return res;
    };
    hifetch(
      Object.assign({}, fetchConfig, {
        error: errorHandler,
      }),
    )
      .send()
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('no timeout, promise style', done => {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error5`,
      timeout: 300,
    };
    const successHandler = res => {
      expect(res.status).to.equal(0);
    };
    hifetch(fetchConfig)
      .send()
      .then(successHandler)
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('no timeout, callback style', done => {
    nock(ROOT)
      .get('/error5')
      .delayConnection(200)
      .reply(200, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error5`,
      timeout: 300,
    };
    const successHandler = res => {
      expect(res.status).to.equal(0);
    };
    hifetch(
      Object.assign({}, fetchConfig, {
        success: successHandler,
      }),
    )
      .send()
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});
