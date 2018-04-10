import { Component, createElement, StrictMode } from 'react';
import createHoc from './createHoc';

export default function errorBoundary(opt = {}) {
  const {
    logger,
    fallbackRender = function fallbackUi(error) {
      return error.toString();
    },
    enableStrictMode = false,
  } = opt;
  return createHoc(
    WrappedComponent =>
      class WithErrorBoundary extends Component {
        state = { error: null, errorInfo: null };

        componentDidCatch(error, errorInfo) {
          this.setState({
            error,
            errorInfo,
          });
          if (logger) {
            logger(error, errorInfo, this.props);
          }
        }

        render() {
          const { error, errorInfo } = this.state;
          if (error) {
            return fallbackRender(error, errorInfo, this.props);
          }
          const { ...passThroughProps } = this.props;
          return enableStrictMode
            ? createElement(
                StrictMode,
                {},
                createElement(WrappedComponent, {
                  ...passThroughProps,
                }),
              )
            : createElement(WrappedComponent, {
                ...passThroughProps,
              });
        }
      },
  );
}
