/* eslint no-unused-expressions: 0 */

const { expect } = require('chai');
const corsManager = require('./corsManager');

describe('corsManager', () => {
  it('no arguments', () => {
    const config = corsManager._testConfig({});
    expect(config.origin).to.be.true;
    expect(config.methods).to.equal('GET,HEAD,PUT,PATCH,POST,DELETE');
    expect(config.exposedHeaders).to.eql(['Link', 'X-API-Version']);
  });

  it('with arguments', () => {
    const config = corsManager._testConfig({
      whitelist: ['http://www.a.com'],
      skipWhitelist: false,
      methods: ['PATCH', 'TEST'],
      headers: ['X-Test'],
    });
    expect(config.origin).to.be.a('function');
    config.origin('http://www.a.com', (_, isAllow) => {
      expect(isAllow).to.be.true;
    });
    config.origin('http://www.b.com', (_, isAllow) => {
      expect(isAllow).to.be.false;
    });
    expect(config.methods.split(',')).to.have.members([
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'TEST',
    ]);
    expect(config.exposedHeaders).to.have.members([
      'Link',
      'X-API-Version',
      'X-Test',
    ]);
  });
});
