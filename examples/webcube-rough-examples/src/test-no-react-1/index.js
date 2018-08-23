// import React from 'react';
import b from './b';
import { main } from './main';

import data from './data.json';

console.log(1, data);

import('./a').then(({ default: a }) => {
  console.log(3, a);
  console.log(4, a.talk(2));
});

import('./c').then(({ default: C }) => {
  console.log(31, new C());
  console.log(41, new C().talk(2));
});

console.log(2, b.talk(2));

main.test();

// console.log(React);
