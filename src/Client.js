const { v4: uuidv4 } = require("uuid");
const RconConnection = require("./Connection");
const { createRequest, readResponse } = require("./helpers");

const pkgTypes = Object.freeze({
  AUTH: 3,
  COMMAND: 2,
});

class Deferred {
  constructor() {
    this.resolve = null;
    this.reject = null;
    const promiseFn = (resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    };
    this.promise = new Promise(promiseFn.bind(this));
  }
}

module.exports = class Client {
  constructor(adapter, port, host) {
    const { connectionProtocol } = adapter;
    const connection = new RconConnection(connectionProtocol).on(
      "data",
      this.receive.bind(this)
    );
    Object.assign(this, {
      port,
      host,
      connection,
      deferredPromises: {},
    });
  }

  send(type, body, id) {
    const _id = id || uuidv4();
    // if (this.deferredPromises[_id]) {
    //   // todo: throw
    //   return;
    // }
    const req = createRequest(type, _id, body);
    this.connection.send(req);
    const deferredPromise = new Deferred();
    this.deferredPromises[id] = deferredPromise;
    console.log("sent");
    return deferredPromise.promise;
  }

  receive(response) {
    const res = readResponse(response);
    console.log("res", res);
    const deferredPromise = this.deferredPromises[res.id];
    if (deferredPromise) {
      deferredPromise.resolve(res);
      delete this.deferredPromises[res.id];
    }
  }

  async exec(type, body) {
    try {
      const res = await this.send(type, body);
      return res;
    } catch (err) {
      console.error("Unknown error:", err);
    }
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.connection.on("connect", () => {
        resolve();
        this.connection.off("connect");
      });
      this.connection.on("error", () => {
        reject();
        this.connection.off("error");
      });
      this.connection.connect(this.port, this.host);
    });
  }

  async authenticate(password) {
    await this.connect();
    return this.exec(pkgTypes.AUTH, password);
  }

  async command(command) {
    return this.exec(pkgTypes.COMMAND, command);
  }
};