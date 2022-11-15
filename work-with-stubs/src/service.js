const https = require("https");

class Service {
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let body = "";
        response.on("error", reject);
        response.on("data", (data) => (body += data));
        response.on("end", () => resolve(JSON.parse(body)));
      });
    });
  }
  async getMovie(url) {
    const result = await this.makeRequest(url);
    return {
      name: result.Title,
      year: result.Year,
      genre: result.Genre,
    };
  }
}

module.exports = Service;
