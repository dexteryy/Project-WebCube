
import paneStyles from '../styles/pane.scss';
import styles from './JobPane.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  pureRender,
  connect,
  // stateSelector,
  actionDispatcher,
} from '../../../lib/boilerplate';
import Helmet from 'react-helmet';
import * as actionCreators from '../actions';

@connect()
@actionDispatcher(actionCreators, 'actions')
@cssModules(Object.assign(styles, paneStyles))
@pureRender()
export default class JobPane extends Component {

  render() {
    // const {
    //   actions,
    // } = this.props;
    return (
      <div styleName="pane">
        <Helmet
          title="Example App - Jobs"
          meta={[
            { name: 'description', content: 'demo' },
          ]} />
        <div styleName="divider">See the results</div>
      </div>
    );
  }

}
