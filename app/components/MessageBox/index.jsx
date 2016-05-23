
import React from 'react';

function MessageBox({
  message,
  successStyle,
  errorStyle,
  titleStyle,
  successIconStyle,
  errorIconStyle,
  contentStyle,
}) {
  let messageTitle, iconBlock;
  const messageStyle = message.status === 0
    ? successStyle
    : errorStyle;
  if (message.title) {
    messageTitle = (
      <div className={titleStyle}>
        {message.title}
      </div>
    );
  }
  if (message.status === 0) {
    iconBlock = <i className={successIconStyle}></i>;
  } else {
    iconBlock = <i className={errorIconStyle}></i>;
  }
  return (
    <div className={messageStyle}>
      {iconBlock}
      <div className={contentStyle}>
        {messageTitle}
        {message.content}
      </div>
    </div>
  );
}

export default MessageBox;
