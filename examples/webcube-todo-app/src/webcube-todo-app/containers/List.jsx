import React, { PureComponent } from 'react';
import { Bind } from 'lodash-decorators';
import cube from '../cube';
import TodoList from '../components/TodoList';

class List extends PureComponent {
  @Bind
  handleToggleAll() {
    this.props.actions.todo.toggleAll();
  }

  @Bind
  createHandleToggle(id) {
    return () => {
      this.props.actions.todo.toggle({ id });
    };
  }

  @Bind
  createHandleDelete(id) {
    return () => {
      this.props.actions.todo.delete({ id });
    };
  }

  @Bind
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

export default List
  |> cube.connect({
    select: [state => state.todo.items],
    transform: items => ({
      items,
      isAllCompleted: !items.find(item => !item.isCompleted),
    }),
  });
