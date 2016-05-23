/* eslint no-unused-expressions: 0 */
import chai from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import WelcomeBox from '../WelcomeBox';

chai.should();

describe('WelcomeBox', function () {

  let root;

  beforeEach(function () {
    root = document.getElementById('root');
    if (!root) {
      root = document.createElement('DIV');
      root.id = 'root';
      document.body.appendChild(root);
    }
    ReactDOM.render(React.createElement(WelcomeBox, {
      message: 'TESTING',
    }), root);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(root);
  });

  it('should be mounted', function () {
    root.querySelectorAll('.welcome-box').length.should.equal(1);
  });

});
