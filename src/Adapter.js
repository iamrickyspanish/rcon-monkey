module.exports = class Adapter {
  constructor(protocol, serialize, parse) {
    this.connectionProtocol = protocol;
    this.serialize = serialize;
    this.parse = parse;
    Object.freeze(this);
  }
};
