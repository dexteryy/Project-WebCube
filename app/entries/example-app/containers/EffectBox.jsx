
import React, { Component } from 'react';
import {
  pureRender,
} from 'internals/lib/boilerplate';
import toLower from 'lodash/toLower';
import SelectorBox from '../../../components/SelectorBox';
import {
  animations, buttonStyles,
} from './ResultBox';

@pureRender()
export default class EffectBox extends Component {

  state = {
    selectedEffect: '',
    selectedStyle: '',
    feedback: null,
  };

  clearFeedback() {
    if (this.state.feedback) {
      this.setState({
        feedback: null,
      });
    }
  }

  handleEffectSelect = (e) => {
    this.clearFeedback();
    this.setState({
      selectedEffect: e.target.value,
    });
  };

  handleStyleSelect = (e) => {
    this.clearFeedback();
    this.setState({
      selectedStyle: e.target.value,
    });
  };

  handleSubmit = (res) => {
    if (res.effect && res.style) {
      this.setState({
        selectedEffect: '',
        selectedStyle: '',
        feedback: {
          status: 0,
          content: 'New button added successfully',
        },
      });
      this.props.handleSubmit(res);
    } else {
      this.setState({
        feedback: {
          status: -1,
          content: 'You must choose a animation and a button style',
        },
      });
    }
  };

  render() {
    const {
      readme, submitText,
    } = this.props;
    const {
      selectedEffect, selectedStyle, feedback,
    } = this.state;
    const selectors = [{
      id: 'effect',
      name: 'effect',
      value: selectedEffect,
      placeholder: '--- Choose animation ---',
      handleChange: this.handleEffectSelect,
      options: animations.map((anim) => ({
        id: anim,
        label: anim,
        value: toLower(anim),
      })),
    }, {
      id: 'style',
      name: 'style',
      value: selectedStyle,
      placeholder: '--- Choose button style ---',
      handleChange: this.handleStyleSelect,
      options: buttonStyles.map((style) => ({
        id: style,
        label: style,
        value: toLower(style),
      })),
    }];
    const opt = {
      readme, submitText, selectors, feedback,
      handleSubmit: this.handleSubmit,
    };
    return (
      <SelectorBox {...opt} />
    );
  }

}
