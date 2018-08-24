import React from 'react';

export default function SampleList({ list, onDelete }) {
  return !list.length ? (
    <p>Empty</p>
  ) : (
    <ul>
      {list.map(item => (
        <li key={item.id}>
          <span>{item.text}</span>
          <button type="button" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
