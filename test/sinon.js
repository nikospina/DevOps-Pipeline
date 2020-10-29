const assert = require('assert');
const sinon = require('sinon');
const greeter = require('../greeter.js');

describe('testing the greeter', () => {
  it('checks the greet function', () => {
    const clock = sinon.useFakeTimers(new Date(2020, 2, 15));
    assert.equal(greeter.greet('Alice'), 'Hello, Alice! Today is Sunday, March 15, 2020.');
    clock.restore();
  });
});
