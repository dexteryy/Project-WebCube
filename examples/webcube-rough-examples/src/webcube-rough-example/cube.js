import connectSource from 'redux-source-connect';
import { createCube } from 'redux-cube';

const cube = createCube({
  connectSource,
});

export default cube;
