/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('error: 2', () => {
  it('promise style', done => {
    nock(ROOT)
      .get('/error2')
      .reply(500, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error2`,
    };
    const errorHandler = res => {
      expect(res.status).to.equal(2);
      expect(res.httpStatus).to.equal(500);
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

  it('callback style', done => {
    nock(ROOT)
      .get('/error2')
      .reply(500, {
        status: 0,
      });
    const fetchConfig = {
      url: `${ROOT}/error2`,
    };
    const errorHandler = res => {
      expect(res.status).to.equal(2);
      expect(res.httpStatus).to.equal(500);
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
});
