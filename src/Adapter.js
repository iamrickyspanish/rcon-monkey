module.exports = class Adapter {
  constructor() {
    this.connectionProtocol = null;
    this.sendPackage = null;
    this.receivePackage = null;
    Object.freeze(this);
  }
};
