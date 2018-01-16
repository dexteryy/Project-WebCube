import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';
import { connect } from 'redux-cube';

import { actions } from '../ducks/sample';
import { TITLE } from '../constants/sample';
import SampleList from '../components/SampleList';

@connect({
  selectors: [state => state.items.log, state => state.items.message],
  transform: (log, message) => ({
    log,
    message,
  }),
  actions,
})
export default class Sample extends PureComponent {
  @autobind
  handleReset() {
    this.props.actions.reset();
  }

  @autobind
  handleSend(e) {
    if (e.key === 'Enter') {
      this.props.actions.send(e.target.value);
      e.target.value = '';
    }
  }

  @autobind
  handleRemove(id) {
    this.props.actions.log.removeItem(id);
  }

  render() {
    const { log, message } = this.props;
    return (
      <div>
        <Helmet title={TITLE} meta={[{ name: 'description', content: '' }]} />
        <h1>{TITLE}</h1>
        <p>
          <input type="button" value="Reset" onClick={this.handleReset} />
        </p>
        <h2>Message:</h2>
        <p>
          <input type="text" onKeyPress={this.handleSend} />
        </p>
        <p>{message}</p>
        <h2>Log:</h2>
        <SampleList list={log.slice().reverse()} onDelete={this.handleRemove} />
      </div>
    );
  }
}
