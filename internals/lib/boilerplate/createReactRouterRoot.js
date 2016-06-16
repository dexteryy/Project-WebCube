/* @flow */

import React from 'react';
import { Router, browserHistory, hashHistory } from 'react-router';

type Opt = {
  isStaticWeb?: boolean,
  routes?: Object,
};

export default function createReactRouterRoot(opt: Opt): Function {
  const history = opt.isStaticWeb ? hashHistory : browserHistory;
  return function Root() {
    return React.createElement(Router, {
      history,
      routes: opt.routes,
    });
  };
}
