const Fibonacci = require("./fibonacci");
const sinon = require("sinon");
const assert = require("assert");

(async () => {
  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);

    for (const i of fibonacci.execute(3)) {
    }

    const expectedCallCount = 4;
    assert.deepStrictEqual(spy.callCount, expectedCallCount);
  }
  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    const [...result] = fibonacci.execute(5);
    const { args } = spy.getCall(2);
    const expectedResult = [0, 1, 1, 2, 3];
    const expectedParams = Object.values({
      input: 3,
      curret: 1,
      next: 2,
    });

    assert.deepStrictEqual(args, expectedParams);
    assert.deepStrictEqual(result, expectedResult);
  }
})();
