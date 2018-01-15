import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';

const noop = () => {
  /* */
};

export default class TodoItem extends PureComponent {
  static defaultProps = {
    content: '',
    isCompleted: false,
    onToggle: noop,
    onDelete: noop,
    onSubmit: noop,
  };

  state = {
    input: '',
    isEditing: false,
  };

  constructor(props) {
    super(props);
    this.state.input = props.content;
  }

  componentWillReceiveProps({ content }) {
    if (content !== this.props.content) {
      this.setState({ input: content });
    }
  }

  @autobind
  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  @autobind
  handleEnter(e) {
    if (e.key === 'Enter') {
      this.submitInput();
    }
  }

  @autobind
  handleBlur() {
    this.submitInput();
  }

  @autobind
  handleStartInput() {
    this.startInput();
  }

  @autobind
  startInput() {
    this.setState({
      isEditing: true,
    });
    setTimeout(() => {
      this.editor.select();
    }, 50);
  }

  @autobind
  submitInput() {
    this.props.onSubmit(this.state.input);
    this.setState({
      isEditing: false,
    });
  }

  render() {
    const { content, isCompleted, onToggle, onDelete } = this.props;
    const { input, isEditing } = this.state;
    return (
      <li
        className={`${isCompleted ? 'completed' : ''} ${
          isEditing ? 'editing' : ''
        }`}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={isCompleted}
            readOnly={true}
            onClick={onToggle}
          />
          <label onDoubleClick={this.handleStartInput}>{content}</label>
          <button type="button" className="destroy" onClick={onDelete} />
        </div>
        <input
          className="edit"
          value={input}
          ref={elm => (this.editor = elm)}
          onChange={this.handleInput}
          onKeyPress={this.handleEnter}
          onBlur={this.handleBlur}
        />
      </li>
    );
  }
}
