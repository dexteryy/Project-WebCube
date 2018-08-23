import React from 'react';

export default function SampleList({ list, onDelete }) {
  return !list.length ? (
    <p>Empty</p>
  ) : (
    <ul>
      {list.map(item => (
        <li key={item.id}>
          <span>{item.text}</span>
          {/* eslint-disable react/jsx-no-bind */}
          <button type="button" onClick={() => onDelete(item.id)}>
            Delete
          </button>
          {/* eslint-enable react/jsx-no-bind */}
        </li>
      ))}
    </ul>
  );
}
