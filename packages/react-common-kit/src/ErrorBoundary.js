import { Component, createElement, StrictMode } from 'react';

function DefaultFallbackComponent(error) {
  return error.toString();
}

export default class ErrorBoundary extends Component {
  state = { error: null, info: null };

  componentDidCatch(error, info) {
    this.setState({
      error,
      info,
    });
    if (this.props.logger) {
      this.props.logger(error, info, this.props);
    }
  }

  render() {
    const {
      FallbackComponent = DefaultFallbackComponent,
      enableStrictMode,
      children,
    } = this.props;
    const { error, info } = this.state;
    if (error) {
      return createElement(FallbackComponent, { error, info });
    }
    return enableStrictMode
      ? createElement(StrictMode, { children }, children)
      : children;
  }
}
