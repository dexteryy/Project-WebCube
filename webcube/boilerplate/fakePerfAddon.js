const fakeFn = function fakeFn() {
  //
};

const fakePerfAddon = {
  start: fakeFn,
  stop: fakeFn,
  printInclusive: fakeFn,
  printExclusive: fakeFn,
  printWasted: fakeFn,
  printDOM: fakeFn,
  getLastMeasurements: fakeFn,
};

export default fakePerfAddon;
