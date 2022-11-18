const http = require("http");

const DEFAULT_PORT = 3000;
const DEFAULT_HEADERS = {
  "Content-Type": "text/html",
};

class Api {
  gerateRoutes() {
    return {
      "/rent:get": (request, response) => {
        response.write("faz um rent");
        return response.end();
      },
      default: (request, response) => {
        response.write("Default route!");
        return response.end();
      },
    };
  }

  handler(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;
    const routes = this.gerateRoutes();
    const chosen = routes[routeKey] || routes.default;
    response.writeHead(200, DEFAULT_HEADERS);
    return chosen(request, response);
  }

  initialize(port = DEFAULT_PORT) {
    const app = http
      .createServer(this.handler.bind(this))
      .listen(port, () => console.log("app running at", port));

    return app;
  }
}

module.exports = Api;
