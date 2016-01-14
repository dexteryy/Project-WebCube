/* eslint no-magic-numbers: 0, no-unused-vars: 0 */

/*!
 * dd
 */

// import "babel-polyfill";
// import 'core-js/shim';
// import Reflect from 'core-js/es6/reflect';
import 'babel-regenerator-runtime';
import React from 'react';

let b, c;

const foo2 = () => {};

const y1 = {
  a: 1,
};
const y2 = { a: 1 };

const mm = (x, y) => {
  for (let i in [1, 2, 3]) {
    console.log(++i, `ff`);
  }
  return (
    <div className="yy">
      <span>fdsaf</span>
    </div>
  );
};

(function () {
  //
})();

// mm.apply(y2, []);
Reflect.apply(mm, y2, []);

const obj = {
  b,
  c,
  "a'-b": () => ({}),
  'while': 2,
  a: 1,
  b_c: [10, 11, , 12],

  m2() {
    return typeof YYY;
  },

  m1(a, c, b) {
    return a + b;
  },
};

class A {

  constructor() {
    //
  }

}

/**
 * [y3 description]
 * @param  {string} a [description]
 * @param  {number} b [description]
 * @return {string}   [description]
 */
function y3(a, { b = 'y' }) {
  const A = 1;
  const Object = 2;
  // a = 'yy' + b;
  return `yy${b}`;
}

[].forEach(() => {
  let a, b, c,
    d, e;
  let f = 1;
  f = 2;
  //
});

const test2 = a => {
  if (a === 1 && !!a) {
    // function "yy"() {}
    // let d = 0;
    const c = ```aaaa
      afdf```;
    const c2 = 'aaaa'
      + ' bbbb';
    return true;
  }
  // ff
  switch (1) {
    case 2: {
      const x = 1;
      break;
    }
    case 3:
      break;
    case 4:
      break;
    default:
      break;
  }
  return a;
};

((a, b) => {
  a();
  return a;
})();

((a, b) => a + b)();

const xx = (a, b) => {
  b();
  return a;
};

function foo(a) {
  for (;;) {
    if (a > 1) {
      if (a > 2) {
        const a = () => {
          if (a > 3) {
            //
            if (a > 4) {
              //
            }
          }
        };
      }
    }
  }
}

function* test(a) {
  let b = a;
  b = yield ++b;
  b = yield ++b;
  b = yield ++b;
}

const g = test(1);
console.log(g.next(10)); // 11
console.log(g.next(20));
console.log(g.next(30));
console.log(g.next(40));

// if (b => 2) {
//   //
// }

class Person {
  @nonenumerable
  get kidCount() {
    return this.children.length;
  }
}

const description = {
  type: 'accessor',
  get: specifiedGetter,
  enumerable: true,
  configurable: true,
};

function nonenumerable(target, name, description) {
  descriptor.enumerable = false;
  return descriptor;
}

setTimeout(() => {
  require(['./a'], (a) => {
    console.info(a);
  });
  require(['./aync/a'], (aAync) => {
    console.info(aAync);
  });
  // require.ensure(["./a"], function(require) {
  //   let a = require("./a");
  // }, "a");
  // require.ensure(["./aync/a"], function(require) {
  //   let aAync = require("./aync/a");
  // }, "aync/a");
});
