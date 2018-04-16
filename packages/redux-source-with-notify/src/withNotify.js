import React, { Component, createRef } from 'react';
import { createHoc } from 'react-common-kit';

export default function withNotify(config = {}) {
  const {
    trigger: Trigger,
    onSuccess,
    onError,
    sourceStateName = 'source',
    disbleErrorLogger = false,
    errorTexts = {},
    filter,
  } = config;
  return createHoc(
    TargetComponent =>
      class WithNotify extends Component {
        trigger = createRef();

        state = {
          isPending: false,
          result: null,
          errors: [],
          hasNotify: false,
        };

        componentDidUpdate({ [sourceStateName]: { isPending, result } }) {
          const {
            [sourceStateName]: {
              isPending: nextIsPending,
              errors: nextErrors,
              result: nextResult,
            },
          } = this.props;
          if (
            (result !== null && filter && !filter(result, nextResult)) ||
            !(isPending && !nextIsPending)
          ) {
            return;
          }
          if (nextErrors.length) {
            onError(this.trigger.current, nextErrors);
            if (
              nextErrors.length &&
              !disbleErrorLogger &&
              typeof console === 'object' &&
              console.error
            ) {
              nextErrors.forEach(error => {
                if (!errorTexts[error.message]) {
                  console.error(
                    `${sourceStateName} error:`,
                    error.stack || error,
                  );
                }
              });
            }
          } else {
            onSuccess(this.trigger.current);
          }
        }

        render() {
          const { ...passThroughProps } = this.props;
          return (
            <div>
              <TargetComponent {...passThroughProps} />
              {Trigger && <Trigger ref={this.trigger} />}
            </div>
          );
        }
      },
  );
}
