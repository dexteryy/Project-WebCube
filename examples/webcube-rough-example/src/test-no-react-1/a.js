import { merge } from 'lodash';

console.log(merge);

const a = {
  talk(n: number) {
    return Object.assign({}, { n });
  },
};
export default a;
