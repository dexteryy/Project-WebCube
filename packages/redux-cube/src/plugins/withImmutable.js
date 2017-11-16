// https://www.npmjs.com/package/redux-immutable
import { combineReducers } from 'redux-immutable';

// https://redux.js.org/docs/recipes/UsingImmutableJS.html#what-are-the-issues-with-using-immutablejs
export default function withImmutable({ ...config }) {
  return {
    _enableImmutable: true,
    _immutableCombineReducers: combineReducers,
    ...config,
  };
}
