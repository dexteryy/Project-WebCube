import React from 'react';
import TodoItem from '../TodoItem';

const noop = () => {
  /* */
};

export default function TodoList({
  isHidden = false,
  items = [],
  isAllCompleted = false,
  onToggleAll = noop,
  createOnToggle = noop,
  createOnDelete = noop,
  createOnSubmit = noop,
}) {
  return !isHidden ? (
    <section className="main">
      <input
        className="toggle-all"
        type="checkbox"
        checked={isAllCompleted}
        readOnly={true}
      />
      <label htmlFor="toggle-all" onClick={onToggleAll}>
        Mark all as complete
      </label>
      <ul className="todo-list">
        {items.map(item => (
          <TodoItem
            key={item.id}
            {...item}
            onToggle={createOnToggle(item.id)}
            onDelete={createOnDelete(item.id)}
            onSubmit={createOnSubmit(item.id)}
          />
        ))}
      </ul>
    </section>
  ) : null;
}
