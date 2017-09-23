import React from 'react';

export default function createReactRoot({ AppRoot, options }) {
  return function Root() {
    return React.createElement(AppRoot, options);
  };
}
