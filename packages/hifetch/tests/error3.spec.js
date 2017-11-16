/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('error: 3', () => {
  it('promise style', done => {
    nock(ROOT)
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/error3')
      .reply(200, {
        status: -1,
        message: 'wrong request',
      });
    const fetchConfig = {
      url: `${ROOT}/error3`,
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    };
    const errorHandler = res => {
      expect(res.status).to.equal(3);
      expect(res.data.status).to.equal(-1);
      expect(res.data.poweredBy).to.equal('nock');
      expect(res.httpStatus).to.equal(200);
      expect(res.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
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
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/error3')
      .reply(200, {
        status: -1,
        message: 'wrong request',
      });
    const fetchConfig = {
      url: `${ROOT}/error3`,
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    };
    const errorHandler = res => {
      expect(res.status).to.equal(3);
      expect(res.data.status).to.equal(-1);
      expect(res.data.poweredBy).to.equal('nock');
      expect(res.httpStatus).to.equal(200);
      expect(res.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
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
