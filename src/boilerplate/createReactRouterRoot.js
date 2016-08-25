/* @flow */

import React from 'react';
import { Router, browserHistory, hashHistory } from 'react-router';

type Opt = {
  isStaticWeb?: boolean,
  routes?: Object,
  rootProps?: Object,
};

export default function createReactRouterRoot(opt: Opt): Function {
  const history = opt.isStaticWeb ? hashHistory : browserHistory;
  let routes = opt.routes;
  if (!React.isValidElement(routes)) {
    const rootComponent = routes.component;
    routes = Object.assign({}, routes, {
      component: (props) => {
        const newProps = Object.assign({}, opt.rootProps, props);
        delete newProps.children;
        return React.createElement(rootComponent, newProps, props.children);
      },
    });
  }
  return function Root() {
    return React.createElement(Router, {
      history,
      routes,
    });
  };
}
