import { Component, createElement } from 'react';
import { createHoc } from 'react-common-kit';
import { CubeContext } from './context';

export default function load({ mark, loader, isLoaded }) {
  return createHoc(
    OriginComponent =>
      class WithLoader extends Component {
        componentDidMount() {
          if (!isLoaded(this.props)) {
            loader(this.props);
          }
        }

        render() {
          return createElement(
            CubeContext.Consumer,
            {},
            ({ enableSsrPreload }) => {
              if (enableSsrPreload) {
                mark(this.props);
              }
              return createElement(OriginComponent, {
                ...this.props,
              });
            },
          );
        }
      },
  );
}
