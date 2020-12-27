"use strict";

const RconConnection = require("./Connection");

// const rejectOnTimeout = (reject, time = 3000) =>
//   setTimeout(() => {
//     reject(new Error("Timeout"));
//   }, time);

// const defaultOptions = Object.freeze({
//   timoutMs: 3000
// });

module.exports = class Client {
  constructor(adapter, port, host) {
    const connection = new RconConnection(adapter.getProtocol());
    Object.assign(this, {
      adapter,
      port,
      host,
      connection
    });
  }

  async send(message) {
    const req = this.adapter.serialize(message);
    return new Promise((resolve, reject) => {
      try {
        this.connection.send(req);
        const timeout = setTimeout(
          () =>
            this.timeout(reject, [
              ["error", handleError],
              ["receive", handleConnect]
            ]),
          3000
        );

        const handleError = (err) => {
          clearTimeout(timeout);
          this.connection.removeListener("receive", handleReceive);
          reject(err);
        };

        const handleReceive = (res) => {
          clearTimeout(timeout);
          const result = this.adapter.parse(res);
          this.connection.removeListener("error", handleError);
          resolve(result);
        };

        this.connection.once("receive", handleReceive);
        this.connection.once("error", handleError);
      } catch (e) {
        console.error("shit", e);
      }
    });
  }

  async exec(message) {
    try {
      const res = await this.send(message);
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  timeout(reject, obsoleteListeners) {
    try {
      if (Array.isArray(obsoleteListeners))
        for (listenerTupel in obsoleteListeners) {
          if (Array.isArray(listenerTupel)) {
            this.connection.removeListener(...listenerTupel);
          }
        }
      if (typeof reject !== "function") throw "invalid arguments";
      reject(new Error("Timeout"));
    } catch (err) {
      throw `Error handling timeout ${err}`;
    }
  }

  async connect() {
    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () =>
            this.timeout(reject, [
              ["error", handleError],
              ["connect", handleConnect]
            ]),
          3000
        );

        const handleError = (err) => {
          clearTimeout(timeout);
          console.error("error", err);
          this.connection.removeListener("connect", handleConnect);
          reject(err);
        };

        const handleConnect = () => {
          clearTimeout(timeout);
          this.connection.removeListener("error", handleError);
          resolve();
        };

        this.connection.once("error", handleError);
        this.connection.once("connect", handleConnect);
        this.connection.connect(this.port, this.host);
      });
    } catch (err) {
      throw `Connect: ${err}`;
    }
  }

  async authenticate(password) {
    await this.connect();
    const response = await this.exec(this.adapter.getAuthMessage(password));
    this.adapter.processAuthResponse(response);
  }
};
