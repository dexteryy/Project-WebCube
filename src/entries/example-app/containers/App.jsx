
import styles from './App.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  connect,
  actionDispatcher,
} from 'internals/lib/boilerplate';
import { push } from 'react-router-redux';
import TabView from '../../../components/TabView';
import FlipboardLogo from '../../../components/FlipboardLogo';
import { Link } from 'react-router';

@connect()
@actionDispatcher({ push }, 'actions')
@cssModules(styles)
export default class App extends Component {

  render() {
    const {
      children,
      // location, actions,
    } = this.props;
    const menu = [{
      path: '/pane/effects',
      text: 'Effects',
      title: 'Effect Pane',
      icon: styles['icon-photo'],
    }, {
      path: '/pane/jobs',
      text: 'Jobs',
      title: 'Job Pane',
      icon: styles['icon-news'],
    }];
    return (
      <TabView
        id="exampleAppRoot"
        Logo={FlipboardLogo}
        logoWidth={60}
        logoHeight={60}
        title1="EXAMPLE APP"
        title2="This is a demo"
        MenuLink={Link}
        menu={menu}>
        {children}
      </TabView>
    );
  }

}
