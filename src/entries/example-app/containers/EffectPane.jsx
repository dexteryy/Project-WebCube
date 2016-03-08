
import paneStyles from '../styles/pane.scss';
import styles from './EffectPane.scss';
import React, { Component } from 'react';
import cssModules from 'react-css-modules';
import {
  pureRender,
  connect,
  stateSelector,
  actionDispatcher,
} from '../../../lib/boilerplate';
import Helmet from 'react-helmet';
import EffectBox from './EffectBox';
import ResultBox from './ResultBox';
import * as actionCreators from '../actions';
import * as constants from '../constants';

@connect()
@stateSelector(
  state => state.triggers,
  triggers => ({ triggers })
)
@actionDispatcher(actionCreators, 'actions')
@cssModules(Object.assign(styles, paneStyles))
@pureRender()
export default class EffectPane extends Component {

  render() {
    const {
      actions, triggers,
    } = this.props;
    return (
      <div styleName="pane">
        <Helmet
          title={`Effects - ${constants.APP_TITLE}`}
          meta={[
            { name: 'description', content: 'demo' },
          ]} />
        <EffectBox
          readme="Add a new button to trigger an animation effect!"
          submitText="Add"
          handleSubmit={actions.addEffectTrigger} />
        <div styleName="divider">See the results</div>
        <ResultBox
          effectTriggers={triggers}
          removeTrigger={actions.removeEffectTrigger}
          message="Welcome!" />
      </div>
    );
  }

}
