/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('error: 1', () => {
  it('promise style', done => {
    const fetchConfig = {
      url: `${ROOT}/error1`,
    };
    const errorHandler = res => {
      expect(res.status).to.equal(1);
      expect(res.error).to.exist;
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
    const fetchConfig = {
      url: `${ROOT}/error1`,
    };
    const errorHandler = res => {
      expect(res.status).to.equal(1);
      expect(res.error).to.exist;
    };
    hifetch(
      Object.assign({}, fetchConfig, {
        error: errorHandler,
      }),
    )
      .send()
      .catch(errorHandler)
      .then(() => {
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});
