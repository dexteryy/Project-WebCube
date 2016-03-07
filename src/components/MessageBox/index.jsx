
import React from 'react';

function MessageBox({
  message, successStyle, errorStyle, titleStyle,
}) {
  const messageStyle = message.status === 0
    ? successStyle
    : errorStyle;
  let messageTitle;
  if (message.title) {
    messageTitle = (
      <div className={titleStyle}>
        {message.title}
      </div>
    );
  }
  return (
    <div className={messageStyle}>
      {messageTitle}
      {message.content}
    </div>
  );
}

export default MessageBox;
