import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';

import { TITLE } from '../constants/sample';
import SampleList from '../components/SampleList';

let itemId = Date.now() * 1000;

export default class Sample extends PureComponent {
  state = {
    message: '',
    log: [],
  };

  @autobind
  handleReset() {
    this.setState({
      message: '',
      log: [],
    });
  }

  @autobind
  handleSend(e) {
    if (e.key === 'Enter') {
      const { log } = this.state;
      const { value } = e.target;
      this.setState({
        message: 'Sending...',
      });
      setTimeout(() => {
        this.setState({
          message: `Success, Message "${value}" Sent!`,
          log: log.concat([
            {
              id: ++itemId,
              text: value,
            },
          ]),
        });
      }, 1000);
      e.target.value = '';
    }
  }

  @autobind
  handleRemove(id) {
    const { log } = this.state;
    this.setState({
      log: log.filter(item => item.id !== id),
    });
  }

  render() {
    const { log, message } = this.state;
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
