/* eslint no-unused-expressions: 0 */
import chai from 'chai';
import App from '../../';

chai.should();

describe('App', function () {

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

  describe('#opt', function () {

    app = new App();
    app.init({ root });

    it('should have default value', function () {
      app.opt.msg.should.be.a('string');
    });

  });

  describe('#init', function () {

    app = new App();

    it('should have correct elements', function () {
      app.init({ root });
      root.querySelectorAll('.welcome .msg').should.exist;
      root.querySelectorAll('.welcome .ok').should.exist;
    });

  });

});
