const Adapter = require("../Adapter");
const { UDP } = require("../Connection/protocols");

const mapResponseToChallenge = (f) => f;

module.exports = class GoldSrcAdapter extends (
  Adapter
) {
  constructor(...args) {
    super(...args);
    this.challege = null;
    this.password = null;
  }

  getProtocol() {
    return UDP;
  }

  getAuthMessage(password) {
    this.password = password;
    return "challenge rcon";
  }

  processAuthResponse(response) {
    this.challenge = mapResponseToChallenge(response);
  }

  processMessage(message) {
    if (message.startsWith("challenge")) {
      return message;
    } else if (this.challenge && this.password) {
      return `rcon ${this.challenge} ${this.passworg} ${message}`;
    }
  }

  serialize(message) {
    const processedMessage = this.processMessage(message);

    return Buffer.concat([
      Buffer.from([0xff, 0xff, 0xff, 0xff]),
      Buffer.from(processedMessage),
      Buffer.from("\n"),
    ]);
  }
};
