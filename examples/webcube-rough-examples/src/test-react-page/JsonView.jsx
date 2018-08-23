import React from 'react';
// import { loader } from 'react-common-kit';

function JsonView({ initialData, isInitialDataLoading }) {
  return (
    <div>
      <p>JSON:</p>
      <code>{initialData}</code>
    </div>
  );
}

export default JsonView;
// |> loader(() => import('../data/data.json'));
