
import shallowCompare from 'react-addons-shallow-compare';
// import * from './utils';

module.exports = {
  ...require('./app'),
  ...require('./connectors'),

  pureRender() {
    return (Component) => {
      Component.prototype.shouldComponentUpdate
        = function (nextProps, nextState) {
          return shallowCompare(this, nextProps, nextState);
        };
      return Component;
    };
  },

};
