/* eslint-disable filenames/match-exported */
// https://www.npmjs.com/package/redux-persist
import { persistStore, persistReducer } from 'redux-persist';
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
  ...config
}) {
  return {
    _enablePersist: true,
    _persistStore: persistStore,
    _persistReducer: persistReducer,
    _PersistGate: PersistGate,
    // allow dynamic config
    persistStorage,
    persistKey,
    persistConfig,
    ...config,
  };
}
/* eslint-enable filenames/match-exported */
