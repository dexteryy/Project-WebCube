import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'redux-cube';

import { actions as todoActions } from '../reducers/todo';
import TodoList from '../components/TodoList';

@connect({
  select: {
    todo: {
      items: true,
    },
  },
  transform: items => ({
    items,
    isAllCompleted: !items.find(item => !item.isCompleted),
  }),
  actions: todoActions,
})
export default class List extends PureComponent {
  @autobind
  handleToggleAll() {
    this.props.actions.todo.toggleAll();
  }

  @autobind
  createHandleToggle(id) {
    return () => {
      this.props.actions.todo.toggle({ id });
    };
  }

  @autobind
  createHandleDelete(id) {
    return () => {
      this.props.actions.todo.delete({ id });
    };
  }

  @autobind
  createHandleSubmit(id) {
    return content => {
      this.props.actions.todo.update({ id, content });
    };
  }

  render() {
    const { filter, items, isAllCompleted } = this.props;
    const filteredItems = items.filter(filter);
    return (
      <TodoList
        isHidden={filteredItems.length <= 0}
        items={filteredItems}
        isAllCompleted={isAllCompleted}
        onToggleAll={this.handleToggleAll}
        createOnToggle={this.createHandleToggle}
        createOnDelete={this.createHandleDelete}
        createOnSubmit={this.createHandleSubmit}
      />
    );
  }
}
