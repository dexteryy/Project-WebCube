/* @flow */
/* eslint no-useless-constructor: 0 */

import styles from './index.scss';
import SemanticLabelButton from '../SemanticLabelButton';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import throttle from 'lodash/throttle';

type WelcomeBoxProps = {
  message: string;
  bgColor?: string;
};

type WelcomeBoxStates = {
  eyeCatching: string;
};

class WelcomeBox extends Component {

  static defaultProps = {
    bgColor: '#eee',
  };

  constructor(props: WelcomeBoxProps) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  state: WelcomeBoxStates = {
    eyeCatching: '',
  };

  triggerEffect = throttle((effect) => {
    this.setState({ eyeCatching: effect });
    setTimeout(() => {
      this.setState({ eyeCatching: '' });
    }, 1000);
  }, 1010);

  triggerEffectJello = () => {
    this.triggerEffect('jello');
  };

  triggerEffectWobble = () => {
    this.triggerEffect('wobble');
  };

  triggerEffectTada = () => {
    this.triggerEffect('tada');
  };

  triggerEffectFlash = () => {
    this.triggerEffect('flash');
  };

  triggerEffectRubberBand = () => {
    this.triggerEffect('rubberband');
  };

  triggerEffectSwing = () => {
    this.triggerEffect('swing');
  };

  render(): React.Element {
    const { eyeCatching } = this.state;
    const boxStyle = eyeCatching ? `box-${eyeCatching}` : 'box';
    const boxCustomStyles = {
      backgroundColor: this.props.bgColor,
    };
    const styleModules = this.props.styles;
    const babelButtonOpt = {
      className: styleModules['ok-semantic'],
      mainClassName: styleModules['ok-semantic-main'],
      labelClassName: styleModules['ok-semantic-label'],
      text: 'semantic-ui',
    };
    return (
      <div className="welcome-box" styleName={boxStyle} style={boxCustomStyles}>
        <div className="msg" styleName="msg">{this.props.message}</div>
        <button styleName="ok-pure"
          onClick={this.triggerEffectRubberBand}
        >purecss + rubberBand</button>
        <button styleName="ok-pure"
          onClick={this.triggerEffectJello}
        >purecss + jello</button>
        <button styleName="ok-pure"
          onClick={this.triggerEffectWobble}
        >purecss + wobble</button>
        <SemanticLabelButton
          {...babelButtonOpt}
          label="tada"
          onClick={this.triggerEffectTada}
        />
        <SemanticLabelButton
          {...babelButtonOpt}
          label="swing"
          onClick={this.triggerEffectSwing}
        />
        <SemanticLabelButton
          {...babelButtonOpt}
          label="flash"
          onClick={this.triggerEffectFlash}
        />
      </div>
    );
  }

}

export default cssModules(WelcomeBox, styles);
