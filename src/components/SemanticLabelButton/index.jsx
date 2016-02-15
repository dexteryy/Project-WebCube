
import styles from './index.css';
import React from 'react';
import cssModules from 'react-css-modules';

function SemanticLabelButton(props) {
  return (
    <div styleName="button" className={props.className || ''}
      onClick={props.onClick}
    >
      <div styleName="main" className={props.mainClassName || ''}>
        <i styleName="icon"></i>
        <span>{props.text}</span>
      </div>
      <a styleName="label"className={props.labelClassName || ''}>{props.label}</a>
    </div>
  );
}

export default cssModules(SemanticLabelButton, styles);
