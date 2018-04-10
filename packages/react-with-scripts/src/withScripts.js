import { Component, createElement } from 'react';
import { createHoc } from 'react-common-kit';

export default function withScripts(...scripts) {
  return createHoc(
    WrappedComponent =>
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
          return createElement(WrappedComponent, {
            scripts,
            ...passThroughProps,
          });
        }
      },
  );
}
