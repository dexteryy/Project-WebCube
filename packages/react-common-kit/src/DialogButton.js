import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';

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

  static getDerivedStateFromProps(
    { isOpened },
    { isOpened: isOpenedPrev, isModalVisible },
  ) {
    if (isOpened !== isOpenedPrev && isOpened !== isModalVisible) {
      return {
        isModalVisible: isOpened,
        isOpened,
      };
    }
    return null;
  }

  state = {
    /* eslint-disable react/no-unused-state */
    isOpened: false,
    /* eslint-enable react/no-unused-state */
    isModalVisible: false,
  };

  @Bind
  handleTrigger(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.setState({
      isModalVisible: true,
    });
  }

  @Bind
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

  @Bind
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
