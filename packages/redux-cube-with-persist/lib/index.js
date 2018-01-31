/* eslint-disable filenames/match-exported */
// https://www.npmjs.com/package/redux-persist
import { persistStore, persistCombineReducers } from 'redux-persist';
// https://github.com/rt2zz/redux-persist-transform-immutable
import immutableTransform from 'redux-persist-transform-immutable';
import builtInStorage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/lib/integration/react';

export default function withPersist({
  // optional
  // https://github.com/rt2zz/redux-persist#storage-engines
  persistStorage = builtInStorage,
  // optional
  // https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
  persistKey = 'persistRoot',
  // optional
  // https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
  persistConfig = null,
  // optional
  // https://github.com/rt2zz/redux-persist-transform-immutable#usage-with-records
  persistImmutableConfig,
  ...config
}) {
  return {
    _enablePersist: true,
    _persistStore: persistStore,
    _persistCombineReducers: persistCombineReducers,
    _PersistGate: PersistGate,
    _persistImmutableTransform: immutableTransform,
    // allow dynamic config
    persistStorage,
    persistKey,
    persistConfig,
    persistImmutableConfig,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
