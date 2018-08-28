import { Component, createElement } from 'react';
import { createHoc } from 'react-common-kit';

const isSsrEnv = typeof location !== 'object';

export default function load({ loader, isLoaded }) {
  return createHoc(
    OriginComponent =>
      class WithLoader extends Component {
        componentDidMount() {
          if (!isLoaded(this.props)) {
            loader(this.props);
          }
        }

        render() {
          if (isSsrEnv) {
            loader(this.props);
          }
          return createElement(OriginComponent, {
            ...this.props,
          });
        }
      },
  );
}
