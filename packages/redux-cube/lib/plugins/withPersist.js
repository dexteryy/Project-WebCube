// https://www.npmjs.com/package/redux-persist
import { persistStore, persistCombineReducers } from 'redux-persist';
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
  ...config
}) {
  return {
    _enablePersist: true,
    _persistStorage: persistStorage,
    _persistKey: persistKey,
    _persistConfig: persistConfig,
    _persistStore: persistStore,
    _persistCombineReducers: persistCombineReducers,
    _PersistGate: PersistGate,
    ...config,
  };
}
