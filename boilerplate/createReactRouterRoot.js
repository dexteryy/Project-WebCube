
import React from 'react';
// @TODO react-router v4: start
// import {
//   BrowserRouter,
//   HashRouter,
// } from 'react-router-dom';
import {
  Router,
  browserHistory,
  hashHistory,
} from 'react-router';
// @TODO react-router v4: end

export default function createReactRouterRoot({
  // @TODO react-router v4: start
  // AppRoot,
  routes: originalRoutes,
  rootProps,
  // @TODO react-router v4: end
  options,
}) {
  const {
    disableHashRouter,
  } = options;
  // @TODO react-router v4: start
  // const Router = disableHashRouter ? BrowserRouter : HashRouter;
  let routes = originalRoutes;
  const history = disableHashRouter ? browserHistory : hashHistory;
  if (!React.isValidElement(originalRoutes)) {
    const rootComponent = originalRoutes.component;
    routes = Object.assign({}, originalRoutes, {
      component: (props) => {
        const newProps = Object.assign({}, rootProps, props);
        delete newProps.children;
        return React.createElement(rootComponent, newProps, props.children);
      },
    });
  }
  // @TODO react-router v4: end
  // @TODO react-router v4: start
  // return function Root() {
  //   return React.createElement(Router, null,
  //     React.createElement(AppRoot, options));
  // };
  return function Root() {
    return React.createElement(Router, {
      history,
      routes,
    });
  };
  // @TODO react-router v4: end
}
