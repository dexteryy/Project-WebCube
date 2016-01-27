/* @flow */

import React from 'react';
import WelcomeBox from '../../components/WelcomeBox';

type AppViewOptions = {
  message: string;
  bgColor?: string;
};

export default function AppView(props: AppViewOptions) {
  return <WelcomeBox {...props} />;
}
