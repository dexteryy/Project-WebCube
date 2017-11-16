/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import hifetch from '../dist';
import { ROOT } from './utils';

describe('get', () => {
  it('user1, promise style', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
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

  it('user1, promise style, enableMeta', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 1,
      },
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
      enableMeta: true,
    })
      .send()
      .then(meta => {
        expect(meta.data.name).to.equal('user1');
        expect(meta.data.poweredBy).to.equal('nock');
        expect(meta.status).to.equal(0);
        expect(meta.httpStatus).to.equal(200);
        expect(meta.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
        expect(meta.headers['content-type']).to.exist;
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user1, callback style', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 1,
      },
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
      success(res) {
        expect(res.name).to.equal('user1');
        expect(res.poweredBy).to.equal('nock');
        return res;
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

  it('user1, callback style, enableMeta', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/user')
      .query({
        uid: 1,
      })
      .reply(200, {
        name: 'user1',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 1,
      },
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
      enableMeta: true,
      success(meta) {
        expect(meta.data.name).to.equal('user1');
        expect(meta.data.poweredBy).to.equal('nock');
        expect(meta.status).to.equal(0);
        expect(meta.httpStatus).to.equal(200);
        expect(meta.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
        expect(meta.headers['content-type']).to.exist;
        return meta;
      },
    })
      .send()
      .then(meta => {
        expect(meta.data.name).to.equal('user1');
        expect(meta.data.poweredBy).to.equal('nock');
        expect(meta.status).to.equal(0);
        expect(meta.httpStatus).to.equal(200);
        expect(meta.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
        expect(meta.headers['content-type']).to.exist;
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user2', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .get('/user')
      .query({
        uid: 2,
      })
      .reply(200, {
        name: 'user2',
      });
    hifetch({
      url: `${ROOT}/user`,
      query: {
        uid: 2,
      },
      headers: {
        'X-My-Headers': '1',
      },
      success(res) {
        expect(res.name).to.equal('user2');
        return res;
      },
    })
      .send()
      .then(res => {
        expect(res.name).to.equal('user2');
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('text', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/text')
      .reply(200, 'some text');
    hifetch({
      url: `${ROOT}/text`,
      headers: {
        'X-My-Headers': '1',
      },
      parser: response => response.text(),
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    })
      .send()
      .then(res => {
        expect(res).to.equal('some text');
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('text, enableMeta', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/text')
      .reply(200, 'some text');
    hifetch({
      url: `${ROOT}/text`,
      headers: {
        'X-My-Headers': '1',
      },
      parser: response => response.text(),
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
      enableMeta: true,
    })
      .send()
      .then(meta => {
        expect(meta.data).to.equal('some text');
        expect(meta.status).to.equal(0);
        expect(meta.httpStatus).to.equal(200);
        expect(meta.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('array', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/users')
      .reply(200, [
        {
          name: 'user1',
        },
        {
          name: 'user2',
        },
      ]);
    hifetch({
      url: `${ROOT}/users`,
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    })
      .send()
      .then(res => {
        expect(res).to.be.an('array');
        expect(res[0].name).to.equal('user1');
        expect(res.poweredBy).to.not.exist;
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('array, enableMeta', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/users')
      .reply(200, [
        {
          name: 'user1',
        },
        {
          name: 'user2',
        },
      ]);
    hifetch({
      url: `${ROOT}/users`,
      headers: {
        'X-My-Headers': '1',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
      filterHeaders: {
        'X-Powered-By': true,
      },
      enableMeta: true,
    })
      .send()
      .then(meta => {
        expect(meta.data).to.be.an('array');
        expect(meta.data[0].name).to.equal('user1');
        expect(meta.status).to.equal(0);
        expect(meta.httpStatus).to.equal(200);
        expect(meta.headers['X-Powered-By'.toLowerCase()]).to.equal('nock');
        expect(meta.headers['content-type']).to.not.exist;
        expect(meta.poweredBy).to.not.exist;
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});
