
// import "babel-polyfill";
require('regenerator/runtime');

var a = 1;

function * test(a) {
  a = yield a++;
}

var g = test();
console.log(g.next(1));
console.log(g.next(2));
console.log(g.next(3));

setTimeout(() => {
  require(['./a'], (a) => {
    console.info(a);
  });
  require(['./aync/a'], (aAync) => {
    console.info(aAync);
  });
  // require.ensure(["./a"], function(require) {
  //   var a = require("./a");
  // }, "a");
  // require.ensure(["./aync/a"], function(require) {
  //   var aAync = require("./aync/a");
  // }, "aync/a");
});
