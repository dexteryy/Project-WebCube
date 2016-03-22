
import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
// import LogMonitor from 'redux-devtools-log-monitor';
import Inspector from 'redux-devtools-inspector';
// import Dispatcher from 'redux-devtools-dispatch';
// import SliderMonitor from 'redux-slider-monitor';

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-w">
    <Inspector />
  </DockMonitor>
);
