
import React from 'react';
import { createDevTools } from 'redux-devtools';
// https://www.npmjs.com/package/redux-devtools-dock-monitor
import DockMonitor from 'redux-devtools-dock-monitor';
// // https://www.npmjs.com/package/redux-devtools-multiple-monitors
// import MultipleMonitors from 'redux-devtools-multiple-monitors';
// // https://www.npmjs.com/package/redux-devtools-dispatch
// import Dispatcher from 'redux-devtools-dispatch';
// // https://www.npmjs.com/package/redux-devtools-log-monitor
// import LogMonitor from 'redux-devtools-log-monitor';
// // https://www.npmjs.com/package/redux-devtools-filterable-log-monitor
// import FilterableLogMonitor from 'redux-devtools-filterable-log-monitor';
// https://www.npmjs.com/package/redux-devtools-inspector
import Inspector from 'redux-devtools-inspector';
// // https://www.npmjs.com/package/redux-devtools-diff-monitor
// import DiffMonitor from 'redux-devtools-diff-monitor';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    changeMonitorKey="ctrl-m">
    {/* <MultipleMonitors>*/}
      {/* <DiffMonitor theme="tomorrow" />*/}
      {/* <Dispatcher />*/}
      {/* <LogMonitor />*/}
      {/* <FilterableLogMonitor />*/}
    {/* </MultipleMonitors>*/}
    <Inspector />
  </DockMonitor>
);
