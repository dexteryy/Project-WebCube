import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import update from 'immutability-helper';

import hub from '../hub';
import { types as existTypes } from '../actions/sample';

let itemId = Date.now() * 1000;

export const { reducer, types, actions } = hub
  .handle(
    {
      log: {
        addItem: (state, action) =>
          update(state, {
            log: { $push: [Object.assign({ id: ++itemId }, action.payload)] },
          }),
        removeItem: (state, action) =>
          update(state, {
            log: {
              $set: state.log.filter(item => item.id !== action.payload),
            },
          }),
      },
      sendPending: state =>
        update(state, {
          message: { $set: 'Sending...' },
        }),
      sendFulfilled: (state, action) =>
        update(state, {
          message: { $set: `Success, Message "${action.payload}" Sent!` },
        }),
      reset: () => ({
        log: [],
        message: '',
      }),
    },
    {
      log: [],
      message: '',
    },
  )
  .with(existTypes);

export const epics = [
  action$ =>
    action$.pipe(
      ofType('SEND_FULFILLED'),
      map(action => ({
        type: 'LOG/ADD_ITEM',
        payload: { text: action.payload },
      })),
    ),
];
