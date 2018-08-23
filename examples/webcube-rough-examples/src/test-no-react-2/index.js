import d from './d';
import { main } from './main';
import data from './data.json';

console.log(1, data);

import('./c').then(({ default: c }) => {
  console.log(3, c);
  console.log(4, c.talk(2));
});

console.log(2, d.talk(2));

main.test();
