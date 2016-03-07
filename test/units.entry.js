// import 'babel-polyfill';

export const context = require.context('.', true, /units\/.+\.jsx?$/);

context.keys().forEach(context);
