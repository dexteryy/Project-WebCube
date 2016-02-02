/* eslint no-unused-expressions: 0 */
import chai from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import {{pascalCase componentName}} from 'app/components/{{pascalCase componentName}}';

chai.should();

describe('{{pascalCase componentName}}', function () {

  let root;

  beforeEach(function () {
    root = document.getElementById('root');
    if (!root) {
      root = document.createElement('DIV');
      root.id = 'root';
      document.body.appendChild(root);
    }
    ReactDOM.render(React.createElement({{pascalCase componentName}}, {

    }), root);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(root);
  });

  it('should be mounted', function () {
    root.querySelectorAll('.{{dashCase componentName}}').length.should.equal(1);
  });

});
