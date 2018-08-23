import { merge, pick } from 'lodash';

console.log(merge);

class C {
  talk(n) {
    return Object.assign({}, { n });
  }
}

export default C;
