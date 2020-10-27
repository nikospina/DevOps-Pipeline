const assert = require("assert");
const greeter = require("../greeter.js");
const sinon = require("sinon");
 
describe("testing the greeter", function() {
  it("checks the greet function", function() {
    var clock = sinon.useFakeTimers(new Date(2020, 2, 15));
    assert.equal(greeter.greet('Alice'), 'Hello, Alice! Today is Sunday, March 15, 2020.');
    clock.restore();
  });
});