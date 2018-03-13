import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

/* eslint-disable react/jsx-filename-extension */
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
  return TargetComponent => {
    class WithNotify extends Component {
      _trigger = null;

      componentWillReceiveProps({
        [sourceStateName]: {
          isPending: nextIsPending,
          errors: nextErrors,
          result: nextResult,
        },
      }) {
        const { [sourceStateName]: { isPending, result } } = this.props;
        if (filter && !filter(result, nextResult)) {
          return;
        }
        if (isPending && !nextIsPending) {
          if (nextErrors.length) {
            onError(this._trigger, nextErrors);
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
            onSuccess(this._trigger);
          }
        }
      }

      render() {
        const { ...passThroughProps } = this.props;
        return (
          <div>
            <TargetComponent {...passThroughProps} />
            {Trigger && (
              <Trigger
                ref={node => {
                  this._trigger = node;
                }}
              />
            )}
          </div>
        );
      }
    }
    hoistNonReactStatic(WithNotify, TargetComponent);
    WithNotify.displayName = `WithNotify(${getDisplayName(TargetComponent)})`;
    return WithNotify;
  };
}
/* eslint-enable react/jsx-filename-extension */
