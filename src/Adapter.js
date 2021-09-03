const { TCP } = require("./Connection/protocols");

module.exports = class Adapter {
  getProtocol() {
    return TCP;
  }

  async authenticate(sendFn, password) {}

  serialize(message) {
    return message;
  }

  parse(response) {
    return response;
  }
};
