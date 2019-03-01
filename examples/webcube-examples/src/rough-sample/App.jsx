import React from 'react';
import Loadable from 'react-loadable';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
// import styled, { injectGlobal } from 'styled-components';
// import styledSanitize from 'styled-sanitize';
import { Loader } from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { ErrorBoundary } from 'react-common-kit';
import withRouter from 'redux-cube-with-router';
import cube from './cube';
import './ducks/number';
import Number from './containers/Number';
// import Counter from './components/Counter';

// injectGlobal`
//   ${styledSanitize}
//   body {
//     padding: 20px;
//     font-size: 16px;
//   }
// `;

const Loading = () => <Loader type="line-scale" active={true} color="#06f" />;

const Counter = Loadable({
  loader: () => import('./components/Counter'),
  loading: Loading,
});

const Hello = styled.div`
  padding: 10px;
  margin: 10px;
  border: 2px solid #f60;
  font-size: 18px;
`;

function App() {
  return (
    <div>
      <Helmet titleTemplate="%s | Demo App">
        <title>Homepage</title>
        <meta name="description" content="A webcube demo app" />
      </Helmet>
      <Switch>
        <Route path="/counter" component={Counter} />
        <Route path="/number" component={Number} />
        <Route path="/redirect" render={() => <Redirect to="/counter" />} />
        <Route
          path="/"
          exact={true}
          render={() => <Hello>Hello World!</Hello>}
        />
        <Route path="/*" render={() => <Hello>404</Hello>} />
      </Switch>
      <p>
        <Link to="/">{'< Back'}</Link> | <Link to="/number">Show Number</Link> |{' '}
        <Link to="/counter">Show Counter</Link> |{' '}
        <Link to="/redirect">Redirect to Counter</Link>
      </p>
    </div>
  );
}

export default App
  |> cube.createApp({
    plugins: [withRouter],
    ErrorBoundary,
  });
