const Service = require("./service");
const sinon = require("sinon");
const { deepStrictEqual } = require("assert");
const BASE_url_1 = "https://www.omdbapi.com/?apikey=4f65204f&i=tt0499556";
const BASE_url_2 = "https://www.omdbapi.com/?apikey=4f65204f&t=cars";
const mocks = {
  war: require("./mocks/war.json"),
  cars: require("./mocks/cars.json"),
};

(async () => {
  // {
  // vai ara a internet!
  // const service = new Service();
  // const withoutStub = await service.makeRequest(BASE_url_2);
  // console.log(JSON.stringify(withoutStub));
  //  }

  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  stub.withArgs(BASE_url_1).resolves(mocks.war);
  stub.withArgs(BASE_url_2).resolves(mocks.cars);

  {
    const expected = {
      name: "War",
      year: "2007",
      genre: "Action, Crime, Thriller",
    };
    const result = await service.getMovie(BASE_url_1);
    deepStrictEqual(result, expected);
  }

  {
    const expected = {
      name: "Cars",
      year: "2006",
      genre: "Animation, Adventure, Comedy",
    };
    const result = await service.getMovie(BASE_url_2);
    deepStrictEqual(result, expected);
  }
})();
