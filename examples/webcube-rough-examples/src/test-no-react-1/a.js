import { merge, pick } from 'lodash';

console.log(merge);

const a = {
  talk(n) {
    return Object.assign({}, { n });
  },
};
export default a;
