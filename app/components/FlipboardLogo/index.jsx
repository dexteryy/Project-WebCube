/* @flow */

import React from 'react';

type LogoProps = {
  width?: number,
  height?: number,
  colors?: string,
};

function getColors(theme = 'red') {
  const colors = {
    white: {
      vertical: 'rgba(255,255,255,0.1)',
      horizontal: 'rgba(255,255,255,0.25)',
      single: 'rgba(255,255,255,0.4)',
      main: '#FFFFFF',
    },
    red: {
      vertical: '#FFFFFF',
      horizontal: '#FAE8E9',
      single: '#F4D3D4',
      main: '#E02828',
    },
  };
  return colors[theme];
}

function FlipboardLogo({
  width = 60,
  height = 60,
  colors,
}: LogoProps) {
  const col = getColors(colors);
  return (
    <svg
      {...{ width, height }}
      viewBox="0 0 500 500">
      <g
        style={{
          shapeRendering: 'crispEdges',
        }}>
        <path
          d="M0,0 L500,0 L500,500 L0,500 L0,0 Z"
          fill={col.vertical} />
        <path
          d="M200,200 L400,200 L400,100 L200,100 L200,200 Z"
          fill={col.horizontal} />
        <path
          d="M200,200 L300,200 L300,301 L200,301 L200,200 Z"
          fill={col.single} />
        <path
          d="M0,500 L500,500 L500,0 L0,0 L0,500 Z M100,100 L400,100 L400,200 L300,200 L300,301 L200,301 L200,401 L100,401 L100,100 L100,100 Z"
          fill={col.main} />
      </g>
    </svg>
  );
}

export default FlipboardLogo;
