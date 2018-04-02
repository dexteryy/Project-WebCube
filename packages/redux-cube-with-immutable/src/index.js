/* eslint-disable filenames/match-exported */
// https://www.npmjs.com/package/redux-immutable
import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';

// https://redux.js.org/docs/recipes/UsingImmutableJS.html#what-are-the-issues-with-using-immutablejs
export default function withImmutable({ ...config }) {
  return {
    _enableImmutable: true,
    _immutableCombineReducers: combineReducers,
    _initImmutableState: data => fromJS(data),
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
