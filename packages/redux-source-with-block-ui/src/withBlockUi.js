import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

/* eslint-disable react/jsx-filename-extension */
export default function withBlockUi(config = {}) {
  const {
    loader,
    keepInView = true,
    sourceStateName = 'source',
    ...otherProps
  } = config;
  return TargetComponent => {
    /* eslint-disable react/prefer-stateless-function */
    class WithBlockUi extends Component {
      render() {
        const { [sourceStateName]: { isPending } } = this.props;
        return (
          <BlockUi
            {...otherProps}
            blocking={isPending}
            tag="div"
            loader={loader}
            keepInView={keepInView}>
            <TargetComponent {...this.props} />
          </BlockUi>
        );
      }
    }
    /* eslint-enable react/prefer-stateless-function */
    hoistNonReactStatic(WithBlockUi, TargetComponent);
    WithBlockUi.displayName = `WithBlockUi(${getDisplayName(TargetComponent)})`;
    return WithBlockUi;
  };
}
/* eslint-enable react/jsx-filename-extension */
