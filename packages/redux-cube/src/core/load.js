import { Component, createElement } from 'react';
import { createHoc } from 'react-common-kit';

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
          const { ...passThroughProps } = this.props;
          return createElement(OriginComponent, {
            ...passThroughProps,
          });
        }
      },
  );
}
