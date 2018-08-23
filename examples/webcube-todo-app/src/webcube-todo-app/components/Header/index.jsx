import React, { PureComponent } from 'react';
import { Bind } from 'lodash-decorators';

const noop = () => {
  /* */
};

export default class Header extends PureComponent {
  static defaultProps = {
    title: '',
    input: '',
    disableInput: false,
    onChange: noop,
    onSubmit: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      input: props.input,
    };
  }

  @Bind
  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  @Bind
  handleChange() {
    const { onChange } = this.props;
    onChange(this.state.input);
  }

  @Bind
  handleEnter(e) {
    const { onSubmit } = this.props;
    if (e.key === 'Enter') {
      onSubmit(this.state.input);
      this.setState({ input: '' });
    }
  }

  render() {
    const { title, disableInput } = this.props;
    const { input } = this.state;
    return (
      <header className="header">
        <h1>{title}</h1>
        {(!disableInput && (
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus={true}
            value={input}
            onChange={this.handleInput}
            onBlur={this.handleChange}
            onKeyPress={this.handleEnter}
          />
        )) || (
          <div
            style={{
              borderTop: '1px solid #e6e6e6',
              padding: '20px',
              textAlign: 'center',
              fontSize: '16px',
              color: '#777',
            }}>
            Choose one of the labels below to activate
          </div>
        )}
      </header>
    );
  }
}
