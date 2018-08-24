export const main = {
  test: async () => {
    console.log(5, Date.now());
    const time = await new Promise(resolve => {
      setTimeout(() => {
        resolve(Date.now());
      }, 500);
    });
    console.log(6, time);
  },
};

function delay(time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
}

[1000, 2000, 3000, 4000].forEach(async time => {
  await delay(time);
  console.log(time);
});

console.log([100000]);
