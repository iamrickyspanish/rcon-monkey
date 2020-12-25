const { v4: uuidv4 } = require("uuid");
const RconConnection = require("./Connection");

// const pkgTypes = Object.freeze({
//   AUTH: 3,
//   COMMAND: 2,
// });

// class Deferred {
//   constructor() {
//     this.resolve = null;
//     this.reject = null;
//     const promiseFn = (resolve, reject) => {
//       this.resolve = resolve;
//       this.reject = reject;
//     };
//     this.promise = new Promise(promiseFn.bind(this));
//   }
// }

module.exports = class Client {
  constructor(adapter, port, host) {
    const connection = new RconConnection(adapter.getProtocol())
    connection.on(
      "receive",
      this.receive.bind(this)
    );
    Object.assign(this, {
      adapter,
      port,
      host,
      connection,
      deferredPromises: {},
    });
  }

  send(message) {
    const _id = id || uuidv4();
    const req = this.adapter.serialize(message)
    return new Promise((resolve, reject) => {
      this.connection.send(req);

      this.connection.once("error", (err) => {
        reject(err)
      })

      this.connection.once("receive", (res) => {
        const result = this.adapter.parse(res)
        resolve(result)
      })

    })

    // const req = createRequest(type, _id, body);
    // this.connection.send(req);
    // const deferredPromise = new Deferred();
    // this.deferredPromises[id] = deferredPromise;
    // console.log("sent");
    // return deferredPromise.promise;
  }

  // receive(response) {
  //   const res = readResponse(response);
  //   console.log("res", res);
  //   const deferredPromise = this.deferredPromises[res.id];
  //   if (deferredPromise) {
  //     deferredPromise.resolve(res);
  //     delete this.deferredPromises[res.id];
  //   }
  // }

  async exec(message) {
    try {
      const res = await this.send(message);
      return res;
    } catch (err) {
      console.error("Unknown error:", err);
    }
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.connection.once("connect", () => {
        resolve();
      });
      this.connection.once("error", () => {
        reject();
      });
      this.connection.connect(this.port, this.host);
    });
  }

  async authenticate(password) {
    await this.connect();
    return this.exec(this.adapter.getAuthMessage(password));
  }

  async command(command) {
    return this.exec(pkgTypes.COMMAND, command);
  }
};
