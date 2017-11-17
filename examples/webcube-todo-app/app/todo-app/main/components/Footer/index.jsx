import React from 'react';
import { Link } from 'react-router-dom';

const noop = () => {
  /* */
};

export default function Footer({
  isHidden = false,
  count = 0,
  basePath = '',
  currentPath = '',
  onClear = noop,
}) {
  const allUrl = `${basePath}/`;
  const activeUrl = `${basePath}/active`;
  const completedUrl = `${basePath}/completed`;
  return !isHidden ? (
    <footer className="footer">
      <span className="todo-count">
        <strong>{count}</strong> item left
      </span>
      <ul className="filters">
        <li>
          <Link
            to={allUrl}
            className={currentPath === allUrl ? 'selected' : ''}>
            All
          </Link>
        </li>
        <li>
          <Link
            to={activeUrl}
            className={currentPath === activeUrl ? 'selected' : ''}>
            Active
          </Link>
        </li>
        <li>
          <Link
            to={completedUrl}
            className={currentPath === completedUrl ? 'selected' : ''}>
            Completed
          </Link>
        </li>
      </ul>
      <button className="clear-completed" onClick={onClear}>
        Clear completed
      </button>
    </footer>
  ) : null;
}
