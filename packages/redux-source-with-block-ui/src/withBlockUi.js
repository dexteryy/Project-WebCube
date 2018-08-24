import React, { Component } from 'react';
import BlockUi from 'react-block-ui';
import { createHoc } from 'react-common-kit';
import 'react-block-ui/style.css';

export default function withBlockUi(config = {}) {
  const {
    loader,
    keepInView = true,
    sourceStateName = 'source',
    ...otherProps
  } = config;
  return createHoc(
    TargetComponent =>
      /* eslint-disable react/prefer-stateless-function */
      class WithBlockUi extends Component {
        render() {
          const {
            [sourceStateName]: { isPending },
          } = this.props;
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
      },
    /* eslint-enable react/prefer-stateless-function */
  );
}
