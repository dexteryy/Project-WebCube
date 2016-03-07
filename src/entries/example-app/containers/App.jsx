
import styles from './App.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  connect,
  actionDispatcher,
} from '../../../lib/boilerplate';
import { push } from 'react-router-redux';
import TabView from '../../../components/TabView';
import FlipboardLogo from '../../../components/FlipboardLogo';

@connect()
@actionDispatcher({ push }, 'actions')
@cssModules(styles)
export default class App extends Component {

  render() {
    const {
      children, location, actions,
    } = this.props;
    const menu = [{
      path: '/pane/effects',
      text: 'Effects',
      icon: styles['icon-photo'],
      active: false,
    }, {
      path: '/pane/jobs',
      text: 'Jobs',
      icon: styles['icon-news'],
      active: false,
    }];
    menu.find((item) => {
      return item.path === location.pathname;
    }).active = true;
    return (
      <TabView
        id="exampleAppRoot"
        Logo={FlipboardLogo}
        logoWidth={60}
        logoHeight={60}
        title1="EXAMPLE APP"
        title2="This is a demo"
        handleMenuClick={actions.push}
        menu={menu}>
        {children}
      </TabView>
    );
  }

}
