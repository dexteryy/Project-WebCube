
import styles from './index.scss';
import React from 'react';
import MessageBox from '../MessageBox';

function MessageBoxWithStyle({
  message,
  ...props,
}) {
  const styleProps = Object.assign({
    titleStyle: styles['msg-header'],
    contentStyle: styles['msg-content'],
    successIconStyle: styles['msg-icon-ok'],
    errorIconStyle: styles['msg-icon-warn'],
    successStyle: styles['msg-success'],
    errorStyle: styles['msg-error'],
  }, props);
  return (
    <MessageBox
      message={message}
      {...styleProps} />
  );
}

export default MessageBoxWithStyle;
