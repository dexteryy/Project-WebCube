import gql from 'graphql-tag';
// import update from 'immutability-helper';

import hub from '../hub';
import { source } from '../../common/apis/main';
// import { typeDict as existTypeDict } from './actions';

export const reduxSource = source(
  gql`
    query renameMe {
      renameMe {
        id
      }
    }
  `,
);

export const { reducer, actions, types, typeDict } = hub
  .handle(
    {
      ...reduxSource.reducerMap,
    },
    {
      ...reduxSource.initialState,
    },
  )
  .mergeActions({
    ...reduxSource.actions,
    // ...existTypeDict,
  });
