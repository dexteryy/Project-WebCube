import { createElement, forwardRef } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export default function createHoc(fn, opt = {}) {
  const { name, enableRef = false } = opt;
  return WrappedComponent => {
    const NewComponent = fn(WrappedComponent);
    const WithRef =
      enableRef && forwardRef
        ? function WithRef(props, ref) {
            return createElement(NewComponent, {
              ...props,
              forwardedRef: ref,
            });
          }
        : NewComponent;
    hoistNonReactStatic(WithRef, WrappedComponent);
    WithRef.displayName = `${name ||
      NewComponent.name ||
      'WithHoc'}(${getDisplayName(WrappedComponent)})`;
    return enableRef && forwardRef ? forwardRef(WithRef) : WithRef;
  };
}
