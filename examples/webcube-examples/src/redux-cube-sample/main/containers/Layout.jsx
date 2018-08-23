import React from 'react';
import cube from '../cube';

function Layout({ children }) {
  return <div>{children}</div>;
}
export default Layout
  |> cube.connect({
    selectSource: [state => state.renameMe],
  });
