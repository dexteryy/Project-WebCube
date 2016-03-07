
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

@connect()
@stateSelector(
  state => state.triggers,
  triggers => ({ triggers })
)
@actionDispatcher(actionCreators, 'actions')
@cssModules(styles)
@pureRender()
export default class EffectPane extends Component {

  render() {
    const {
      actions, triggers,
    } = this.props;
    return (
      <div styleName="pane">
        <Helmet
          title="Example App - Effects"
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
