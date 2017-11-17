import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

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

  state = {
    input: '',
  };

  constructor(props) {
    super(props);
    this.state.input = props.input;
  }

  componentWillReceiveProps({ input }) {
    // if (input !== this.props.input) {
    this.setState({ input });
    // }
  }

  @autobind
  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  @autobind
  handleChange() {
    const { onChange } = this.props;
    onChange(this.state.input);
  }

  @autobind
  handleEnter(e) {
    const { onSubmit } = this.props;
    if (e.key === 'Enter') {
      onSubmit(this.state.input);
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
