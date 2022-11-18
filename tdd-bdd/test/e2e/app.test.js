const { describe, it, before } = require("mocha");
const request = require("supertest");
const Api = require("../../src/api");
const assert = require("assert");

describe("API Suit test", () => {
  let app = {};

  before(() => {
    const instance = new Api();
    app = {
      instance,
      server: instance.initialize(),
    };
  });

  describe("./rent", () => {
    it("should request the contact page and return Status 200", async () => {
      const response = await request(app.server).get("/rent").expect(200);
      console.log(response);
    });
  });
});
