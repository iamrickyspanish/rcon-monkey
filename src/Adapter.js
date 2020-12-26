const { TCP } = require("./Connection/protocols");

module.exports = class Adapter {
  getProtocol() {
    return TCP;
  }

  getAuthMessage(password) {
    return password;
  }

  processAuthResponse(response) {
    console.log("response:", response);
  }

  serialize(message) {
    return message;
  }

  parse(response) {
    return response;
  }
};
