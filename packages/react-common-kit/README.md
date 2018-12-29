# react-common-kit

[< Back to Project WebCube](https://github.com/dexteryy/Project-WebCube/)

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url] -->

[![Nodei][nodei-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/react-common-kit.svg
[nodei-image]: https://nodei.co/npm/react-common-kit.png?downloads=true
[npm-url]: https://npmjs.org/package/react-common-kit
<!--
[travis-image]: https://img.shields.io/travis/dexteryy/react-common-kit/master.svg
[travis-url]: https://travis-ci.org/dexteryy/react-common-kit
[dep-image]: https://david-dm.org/dexteryy/react-common-kit.svg
[dep-url]: https://david-dm.org/dexteryy/react-common-kit
-->

Wrappers for some common used react components and utilities

```
npm install --save react-common-kit
```

## Get Started

### `createHoc`

```js
import { createHoc } from 'react-common-kit';

export default function withXXX() {
  return createHoc(
    WrappedComponent =>
      class WithXXX extends Component {
        render() {
          const { ...passThroughProps } = this.props;
          return createElement(WrappedComponent, {
            ...passThroughProps,
          });
        }
      },
    // optional
    {
      // optional
      name: 'WithXXX'
      // optional
      enableRef: true,
    },
  );
```

### `ErrorBoundary`

```js
import { ErrorBoundary } from 'react-common-kit';

function YourApp() {
  return (
    <ErrorBoundary
      // optional
      FallbackComponent={YourFallbackComponent}
      // optional
      logger={(error, info, props) => {
        // ...
      }}
      // optional
      enableStrictMode={true}>
      <YourComponents />
    </ErrorBoundary>
  );
}
```

### `DetectClickOutSide`

```js
import { DetectClickOutSide } from 'react-common-kit';

<DetectClickOutSide onClickOutSide={this.hideDropdown}>
  <Dropdown />
</DetectClickOutSide>
```

### `DialogButton`

```js
import DialogButton from './DialogButton'

<DialogButton
  label="Withdraw"
  component={Button}
  actions={[
    {
        text: 'Cancel',
    },
    {
        text: 'Confirm',
        handler: onWithdraw,
        isPrimary: true,
    },
  ]}>
</DialogButton>
```

```js
// DialogButton.jsx
import React from 'react';
import Modal from 'react-modal';
import styled, { createGlobalStyle } from 'styled-components';
import { DialogButton as CommonDialogButton } from 'react-common-kit';

const ActionButton = styled.button.attrs({ type: 'button' })`
  background: #eee;
`;

const PrimaryActionButton = styled.button.attrs({ type: 'button' })`
  background: blue;
`;

const DangerousActionButton = styled.button.attrs({ type: 'button' })`
  background: red;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px;
`;

const Content = styled.div`
  padding: 20px;
`;

const GlobalStyle = createGlobalStyle`
.ReactModal__Overlay { /* ... */ }
.ReactModal__Overlay--after-open { /* ... */ }
.ReactModal__Overlay--before-close { /* ... */ }
.ReactModal__Content { /* ... */ }
.ReactModal__Content--after-open { /* ... */ }
.ReactModal__Content--before-close { /* ... */ }
`;

const modalProps = {
  ariaHideApp: false,
  shouldFocusAfterRender: true,
  shouldCloseOnOverlayClick: false,
  shouldCloseOnEsc: true,
  shouldReturnFocusAfterClose: true,
  closeTimeoutMS: 150,
};

export default function DialogButton({
  children,
  label,
  component,
  actions,
  componentProps,
  isOpened,
}) {
  return (
    <CommonDialogButton
      modal={Modal}
      modalVisibleProp="isOpen"
      modalProps={modalProps}
      actionButton={ActionButton}
      primaryActionButton={PrimaryActionButton}
      dangerousActionButton={DangerousActionButton}
      actionsContainer={ActionsContainer}
      label={label}
      component={component}
      actions={actions}
      componentProps={componentProps}
      isOpened={isOpened}>
      <Content>{children}</Content>
      <GlobalStyle />
    </CommonDialogButton>
  );
}

```
