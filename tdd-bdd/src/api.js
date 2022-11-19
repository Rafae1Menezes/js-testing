const http = require("http");
const { join } = require("path");
const CarService = require("./services/carService");

const DEFAULT_PORT = 3000;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

defaultFactory = () => ({
  carService: new CarService({
    cars: join(__dirname, "..", "database", "cars.json"),
  }),
});
class Api {
  constructor(dependencies = defaultFactory()) {
    this.carService = dependencies.carService;
  }

  generateRoutes() {
    return {
      "/getAvailableCar:post": async (request, response) => {
        for await (const body of request) {
          try {
            const { carCategory } = JSON.parse(body);
            const car = await this.carService.getAvailableCar(carCategory);
            response.writeHead(200, DEFAULT_HEADERS);
            response.write(JSON.stringify({ car }));
            response.end();
          } catch (error) {
            console.log("error", error);
            response.writeHead(200, DEFAULT_HEADERS);
            response.write(
              JSON.stringify({ error: "Não foi possível selecionar um carro!" })
            );
            response.end();
          }
        }
      },

      "/calculateFinalPrice:post": async (request, response) => {
        for await (const body of request) {
          try {
            const { customer, carCategory, numberOfDays } = JSON.parse(body);

            const finalPrice = this.carService.calculateFinalPrice(
              customer,
              carCategory,
              numberOfDays
            );

            response.writeHead(200, DEFAULT_HEADERS);
            response.write(JSON.stringify({ finalPrice }));
            response.end();
          } catch (error) {
            console.log("error", error);
            response.writeHead(200, DEFAULT_HEADERS);
            response.write(
              JSON.stringify({ error: "Não foi possível calcular o preço!" })
            );
            response.end();
          }
        }
      },

      "/rent:post": async (request, response) => {
        for await (const body of request) {
          try {
            const { customer, carCategory, numberOfDays } = JSON.parse(body);
            const transaction = await this.carService.rent(
              customer,
              carCategory,
              numberOfDays
            );
            response.writeHead(200, DEFAULT_HEADERS);
            response.write(JSON.stringify({ transaction }));
            response.end();
          } catch (error) {
            console.log("error", error);
            response.writeHead(200, DEFAULT_HEADERS);
            response.write(
              JSON.stringify({ error: "Não foi possível realizar o aluguel" })
            );
            response.end();
          }
        }
      },

      default: (request, response) => {
        response.write(JSON.stringify({ success: "Default Route!" }));
        return response.end();
      },
    };
  }

  handler(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;
    const routes = this.generateRoutes();
    const chosen = routes[routeKey] || routes.default;
    response.writeHead(200, DEFAULT_HEADERS);
    return chosen(request, response);
  }

  inicilizate(port = DEFAULT_PORT) {
    const app = http
      .createServer(this.handler.bind(this))
      .listen(port, () => console.log("app running at", port));
    return app;
  }
}

if (process.env.NODE_ENV !== "test") {
  const api = new Api();
  api.initialize();
}

module.exports = (dependencies) => new Api(dependencies);
