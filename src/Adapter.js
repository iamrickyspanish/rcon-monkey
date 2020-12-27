const { TCP } = require("./Connection/protocols");

module.exports = class Adapter {
  getProtocol() {
    return TCP;
  }

  getAuthMessage(password) {
    return password;
  }

  processAuthResponse(message) {
    console.log("auth message:", message);
  }

  serialize(message) {
    return message;
  }

  parse(response) {
    return response;
  }
};
