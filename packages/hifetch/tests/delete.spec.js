/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('delete', () => {
  it('user1', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .delete('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'delete',
      query: {
        uid: 1,
      },
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    })
      .send()
      .then(res => {
        expect(res.name).to.equal('user1');
        expect(res.poweredBy).to.equal('nock');
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});
