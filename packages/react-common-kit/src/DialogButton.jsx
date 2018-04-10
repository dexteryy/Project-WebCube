import React, { Component, Fragment } from 'react';
import { autobind } from 'core-decorators';

export default class DialogButton extends Component {
  static defaultProps = {
    trigger: 'button',
    triggerProps: {},
    modal: null,
    isOpened: false,
    modalVisibleProp: 'visible',
    modalProps: {},
    actions: [],
    actionButton: 'button',
    primaryActionButton: 'button',
    dangerousActionButton: 'button',
    actionsContainer: 'div',
  };

  static getDerivedStateFromProps({ isOpened }, { isModalVisible }) {
    if (typeof isOpened === 'boolean' && isOpened !== isModalVisible) {
      return {
        isModalVisible: isOpened,
      };
    }
    return null;
  }

  state = {
    isModalVisible: false,
  };

  @autobind
  handleTrigger(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({
      isModalVisible: true,
    });
  }

  @autobind
  handleAction(handler) {
    return () => {
      let res = true;
      if (handler) {
        res = handler();
      }
      if (typeof res !== 'boolean' || res === true) {
        this.handleHide();
      }
    };
  }

  @autobind
  handleHide() {
    this.setState({
      isModalVisible: false,
    });
  }

  render() {
    const {
      component: TriggerButton,
      componentProps,
      label,
      modal: Modal,
      modalVisibleProp,
      modalProps,
      children,
      actions,
      actionButton: ActionButton,
      primaryActionButton: PrimaryActionButton,
      dangerousActionButton: DangerousActionButton,
      actionsContainer: ActionsContainer,
    } = this.props;
    const { isModalVisible } = this.state;
    return (
      <Fragment>
        <TriggerButton {...componentProps} onClick={this.handleTrigger}>
          {label}
        </TriggerButton>
        <Modal {...modalProps} {...{ [modalVisibleProp]: isModalVisible }}>
          {children}
          {actions.length && (
            <ActionsContainer>
              {actions.map(({ text, handler, isPrimary, isDangerous }) => {
                const Button =
                  (isPrimary && PrimaryActionButton) ||
                  (isDangerous && DangerousActionButton) ||
                  ActionButton;
                return (
                  <Button key={text} onClick={this.handleAction(handler)}>
                    {text}
                  </Button>
                );
              })}
            </ActionsContainer>
          )}
        </Modal>
      </Fragment>
    );
  }
}
