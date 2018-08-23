import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';

import cube from './cube';
import { epics } from './ducks/sample';
import Sample from './containers/Sample';

export default Sample
  |> cube.createApp({
    plugins: [withPersist],
    epics,
    devToolsOptions: { name: 'SampleApp' },
    persistStorage: localforage,
    persistKey: 'sampleRoot1',
  });
