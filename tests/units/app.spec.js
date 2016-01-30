/* eslint no-unused-expressions: 0 */
import chai from 'chai';
import App from '../../';

chai.should();

describe('App', () => {

  let app, root;

  beforeEach(function () {
    root = document.getElementById('welcome');
    if (!root) {
      root = document.createElement('DIV');
      root.id = 'welcome';
      document.body.appendChild(root);
    }
  });

  afterEach(function () {
    root.innerHTML = '';
  });

  describe('#opt', () => {

    app = new App();
    app.init({ root });

    it('should have default value', () => {
      app.opt.msg.should.be.a('string');
    });

  });

  describe('#init', () => {

    app = new App();

    it('should have correct elements', () => {
      app.init({ root });
      root.querySelectorAll('.welcome .msg').should.exist;
      root.querySelectorAll('.welcome .ok').should.exist;
    });

  });

});
