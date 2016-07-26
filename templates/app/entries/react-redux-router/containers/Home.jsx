
import styles from './Home.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  pureRender,
  connect,
  stateSelector,
  actionDispatcher,
} from 'webcube/boilerplate';
import Helmet from 'react-helmet';
import * as actionCreators from '../actions';

@connect()
@stateSelector(
  state => state.list,
  list => ({ list })
)
@actionDispatcher(actionCreators, 'actions')
@cssModules(styles)
@pureRender()
export default class Home extends Component {

  render() {
    // const {
    //   actions, list,
    // } = this.props;
    return (
      <div styleName="page">
        <Helmet
          title="{{titleCase entryName}} - Home"
          meta={[
            { name: 'description', content: '' },
          ]} />
      </div>
    );
  }

}
