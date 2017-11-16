/* eslint no-unused-expressions: 0 */
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import nock from 'nock';
import qs from 'qs';
import FormData from 'form-data';
import hifetch from '../dist';
import { ROOT, checkFormData } from './utils';

const logoFile = path.join(__dirname, '../../tests', 'assets/logo.png');

describe('post', () => {
  it('user3, by urlencoded', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /application\/x-www-form-urlencoded/,
      },
    })
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .post('/user')
      .query({
        uid: 3,
      })
      .reply(200, (uri, requestBody) =>
        Object.assign(qs.parse(requestBody), {
          status: 0,
        }),
      );
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 3,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: {
        name: 'user3',
      },
      mergeHeaders: {
        poweredBy: 'X-Powered-By',
      },
    })
      .send()
      .then(res => {
        expect(res.name).to.equal('user3');
        expect(res.status).to.equal(0);
        expect(res.poweredBy).to.equal('nock');
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user4, by JSON', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /json/,
      },
    })
      .post('/user')
      .query({
        uid: 4,
      })
      .reply(200, (uri, requestBody) =>
        Object.assign(requestBody, {
          status: 0,
        }),
      );
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 4,
      },
      headers: {
        'X-My-Headers': '1',
      },
      dataType: 'json',
      data: {
        name: 'user4',
      },
    })
      .send()
      .then(res => {
        expect(res.name).to.equal('user4');
        expect(res.status).to.equal(0);
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user5, by FormData', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /multipart\/form-data;\s*boundary=/,
      },
    })
      .post('/user')
      .query({
        uid: 5,
      })
      .reply(200, (uri, requestBody) => {
        const body = Buffer.from(requestBody, 'hex').toString();
        return {
          status: 0,
          body,
        };
      });
    const formData = new FormData();
    formData.append('name', 'user5');
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 5,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: formData,
      FormData,
    })
      .send()
      .then(res => {
        expect(res.status).to.equal(0);
        checkFormData(res.body, {
          name: value => {
            expect(value).to.equal('user5');
          },
        });
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user6, by form-data', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /multipart\/form-data;\s*boundary=/,
      },
    })
      .post('/user')
      .query({
        uid: 6,
      })
      .reply(200, (uri, requestBody) => {
        const body = Buffer.from(requestBody, 'hex').toString();
        return {
          status: 0,
          body,
        };
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 6,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: {
        name: 'user6',
      },
      dataType: 'form',
      FormData,
    })
      .send()
      .then(res => {
        expect(res.status).to.equal(0);
        checkFormData(res.body, {
          name: value => {
            expect(value).to.equal('user6');
          },
        });
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user7, by files', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /multipart\/form-data;\s*boundary=/,
      },
    })
      .post('/user')
      .query({
        uid: 7,
      })
      .reply(200, (uri, requestBody) => {
        const body = Buffer.from(requestBody, 'hex').toString();
        return {
          status: 0,
          body,
        };
      });
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 7,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: {
        name: 'user7',
        logo: fs.readFileSync(logoFile),
      },
      dataType: 'form',
      FormData,
    })
      .send()
      .then(res => {
        expect(res.status).to.equal(0);
        checkFormData(res.body, {
          name: value => {
            expect(value).to.equal('user7');
          },
          logo: value => {
            expect(value).to.equal('Content-Type: application/octet-stream');
          },
        });
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  it('user8, by FormData and files', done => {
    nock(ROOT, {
      reqheaders: {
        'X-My-Headers': '1',
        'Content-Type': /multipart\/form-data;\s*boundary=/,
      },
    })
      .post('/user')
      .query({
        uid: 8,
      })
      .reply(200, (uri, requestBody) => {
        const body = Buffer.from(requestBody, 'hex').toString();
        return {
          status: 0,
          body,
        };
      });
    const formData = new FormData();
    formData.append('name', 'user8');
    formData.append('files', fs.readFileSync(logoFile));
    formData.append('files', fs.readFileSync(logoFile));
    let fileCount = 0;
    hifetch({
      url: `${ROOT}/user`,
      method: 'post',
      query: {
        uid: 8,
      },
      headers: {
        'X-My-Headers': '1',
      },
      data: formData,
      FormData,
    })
      .send()
      .then(res => {
        expect(res.status).to.equal(0);
        checkFormData(res.body, {
          name: value => {
            expect(value).to.equal('user8');
          },
          files: value => {
            fileCount++;
            expect(value).to.equal('Content-Type: application/octet-stream');
          },
        });
        expect(fileCount).to.equal(2);
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});
