
import isFunction from 'lodash/isFunction';
import hoistNonReactStatics from 'hoist-non-react-statics';

const assign: Function = Object.assign;

export function isReactComponent(maybeReactComponent: any): boolean {
  return 'prototype' in maybeReactComponent
   && isFunction(maybeReactComponent.prototype.render);
}

export function wrapComponent(start: Function, end: Function): Function {
  return (Component) => {
    if (isReactComponent(Component)) {
      class WrappedComponent extends Component {
        render() {
          start(this, this.props);
          const renderResult = super.render();
          return end(renderResult);
        }
      }
      return hoistNonReactStatics(WrappedComponent, Component);
    }
    const WrappedComponent = (props = {}, ...args) => {
      start(Component, props);
      const renderResult = Component(props, ...args);
      return end(renderResult);
    };
    return assign(WrappedComponent, Component);
  };
}
