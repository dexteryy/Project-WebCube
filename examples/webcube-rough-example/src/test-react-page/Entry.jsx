import React from 'react';
import { Helmet } from 'react-helmet';
import JsonView from './JsonView';
// import { rootLoader } from 'react-common-kit';

function Entry() {
  return (
    <div>
      <Helmet>
        <title>React App</title>
      </Helmet>
      <h2>React App</h2>
      <JsonView />
    </div>
  );
}

export default Entry;
// |> rootLoader();
