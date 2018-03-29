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
      responseStyle: 'unix',
    };
    const errorHandler = res => {
      expect(res).to.be.an('error');
      expect(res.status).to.equal(-1);
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
      responseStyle: 'unix',
    };
    const errorHandler = res => {
      expect(res).to.be.an('error');
      expect(res.status).to.equal(-1);
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

  it('google style response', done => {
    nock(ROOT)
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/error3')
      .reply(400, {
        error: {
          code: 400,
          message: 'wrong request',
          errors: [
            {
              reason: 'ResourceNotFoundException',
              message: 'wrong request',
            },
          ],
        },
        data: {},
      });
    const fetchConfig = {
      url: `${ROOT}/error3`,
      disableStatusValidator: true,
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    };
    const errorHandler = res => {
      expect(res).to.be.an('error');
      expect(res.code).to.equal(400);
      expect(res.originMessage).to.equal(res.errors[0].message);
      expect(res.errors[0].reason).to.equal('ResourceNotFoundException');
      expect(res.data.poweredBy).to.equal('nock');
      expect(res.httpStatus).to.equal(400);
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
});
