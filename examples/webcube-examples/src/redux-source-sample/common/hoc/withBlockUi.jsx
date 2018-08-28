import React from 'react';
import { Loader } from 'react-loaders';
import 'loaders.css/src/animations/line-scale.scss';
import originWithBlockUi from 'redux-source-with-block-ui';
import 'react-block-ui/style.css';

export default function withBlockUi(config = {}) {
  const { keepInView, sourceStateName, ...otherProps } = config;
  return originWithBlockUi({
    ...otherProps,
    loader: <Loader type="line-scale" color="#0099ff" />,
    keepInView,
    sourceStateName,
  });
}
