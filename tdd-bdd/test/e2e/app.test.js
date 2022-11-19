const { describe, it } = require("mocha");
const { expect } = require("chai");
const request = require("supertest");
const { join } = require("path");
const CarService = require("../../src/services/carService");
const SERVER_TEST_PORT = 4000;

const mocks = {
  validCar: require("./../mocks/valid-car.json"),
  validCarCategory: require("./../mocks/valid-carCategory.json"),
  validCustomer: require("./../mocks/valid-customer.json"),
};

describe("E2E API Suite Test", () => {
  let app = {};
  const sandbox = {};

  before(() => {
    const api = require("../../src/api");
    const carService = new CarService({
      cars: join(__dirname, "..", "..", "database", "cars.json"),
    });
    const instance = api({ carService });

    app = {
      instance,
      server: instance.inicilizate(SERVER_TEST_PORT),
    };
  });

  describe("/getAvailableCar:post", () => {
    it("given a carCategory it should return an available car", async () => {
      const car = mocks.validCar;
      const carCategory = {
        ...mocks.validCarCategory,
        carIds: [car.id],
      };

      const response = await request(app.server)
        .post("/getAvailableCar")
        .send({ carCategory })
        .expect(200);

      const responseCar = response.body.car;

      expect(responseCar).to.be.deep.equal(car);
    });
  });

  describe("/calculateFinalPrice:post", () => {
    it("given a carCategory, customer and numberOfDays it should calculate final amount in real", async () => {
      const customer = {
        ...mocks.validCustomer,
        age: 50,
      };

      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
      };

      const numberOfDays = 5;

      const expectedPrice =
        app.instance.carService.currencyFormat.format(244.4);

      const response = await request(app.server)
        .post("/calculateFinalPrice")
        .send({
          customer,
          carCategory,
          numberOfDays,
        })
        .expect(200);

      const responsePrice = response.body.finalPrice;

      expect(expectedPrice).to.be.equal(responsePrice);
    });
  });

  describe("/rent:post", () => {
    it("given a customer and a car category it should return a transaction receipt", async () => {
      const car = mocks.validCar;
      const customer = {
        ...mocks.validCustomer,
        age: 20,
      };
      const carCategory = {
        ...mocks.validCarCategory,
        price: 37.6,
        carIds: [car.id],
      };
      const numberOfDays = 5;

      const expectedStructure = {
        customer,
        car,
        amount: 0,
        dueDate: new Date(),
      };

      const response = await request(app.server)
        .post("/rent")
        .send({ customer, carCategory, numberOfDays })
        .expect(200);

      const resultTransaction = response.body.transaction;

      expect(Object.keys(resultTransaction)).to.be.deep.equal(
        Object.keys(expectedStructure)
      );
      expect(resultTransaction.customer).to.be.deep.equal(customer);
      expect(resultTransaction.car).to.be.deep.equal(car);
      expect(resultTransaction.amount).to.not.be.empty;
      expect(resultTransaction.dueDate).to.not.be.empty;
    });
  });
});
