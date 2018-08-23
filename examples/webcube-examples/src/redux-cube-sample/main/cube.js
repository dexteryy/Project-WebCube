import { createCube } from 'redux-cube';
import connectSource from 'redux-source-connect';

const cube = createCube({ connectSource });

export default cube;
