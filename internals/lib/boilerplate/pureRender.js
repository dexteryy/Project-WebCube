
import shallowCompare from 'react-addons-shallow-compare';

export default function pureRender() {
  return (Component) => {
    Component.prototype.shouldComponentUpdate
      = function (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      };
    return Component;
  };
}
