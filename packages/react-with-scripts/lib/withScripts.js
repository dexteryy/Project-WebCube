import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export default function withScripts(...scripts) {
  return WrappedComponent => {
    class WithScripts extends Component {
      componentDidMount() {
        if (typeof window !== 'undefined') {
          Object.keys(scripts).forEach(name => {
            scripts[name].load();
          });
        }
      }

      render() {
        const { ...passThroughProps } = this.props;
        return React.createElement(WrappedComponent, {
          scripts,
          ...passThroughProps,
        });
      }
    }
    hoistNonReactStatic(WithScripts, WrappedComponent);
    WithScripts.displayName = `WithScripts(${getDisplayName(
      WrappedComponent,
    )})`;
    return WithScripts;
  };
}
