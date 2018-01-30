import hub from '../../hub';

export const { actions, types, typeDict } = hub.add({
  // use redux-promise-middleware
  send: msg =>
    new Promise(resolve => {
      setTimeout(() => resolve(msg), 1000);
    }),
});
