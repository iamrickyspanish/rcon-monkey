const EventEmitter = require("events");
const net = require("net");
const dgram = require("dgram");

const protocols = require("./protocols");

class InvalidProtocolError extends Error {
  constructor(...attr) {
    super(...attr);
    if (!attr.message)
      this.message = "Invalid Protocol. Valid Protocols are: UDP, TCP";
    this.name = "InvalidProtocolError";
  }
}

const mapProtocolToSendFnName = (protocol) => {
  switch (protocol) {
    case protocols.TCP:
      return "write";
    case protocols.UDP:
      return "send";
    default:
      throw new InvalidProtocolError();
  }
};

const mapProtocolToConnectEventName = (protocol) => {
  switch (protocol) {
    case protocols.TCP:
      return "connection";
    case protocols.UDP:
      return "connect";
    default:
      throw new InvalidProtocolError();
  }
};

const mapProtocolToReceiveEventName = (protocol) => {
  switch (protocol) {
    case protocols.TCP:
      return "data";
    case protocols.UDP:
      return "message";
    default:
      throw new InvalidProtocolError();
  }
};

const delegatableEvents = ["error", "listen"];

module.exports = class RconConnection {
  constructor(protocol) {
    this.emitter = new EventEmitter();
    this.emit = this.emitter.emit.bind(this);
    this.on = this.emitter.on.bind(this);
    this.off = this.emitter.off.bind(this);
    this.once = this.emitter.once.bind(this);
    this.isReady = false;
    this.protocol = protocol;
    this.socket =
      this.protocol === protocols.TCP
        ? new net.Socket()
        : dgram.createSocket("udp4");
    this.sendFnName = mapProtocolToSendFnName(this.protocol);

    this.socket.on(mapProtocolToConnectEventName(this.protocol), () => {
      this.isReady = true;
      this.emit("connect");
    });
    this.socket.on("close", () => {
      this.isReady = false;
      this.emit("close");
    });
    this.socket.on(mapProtocolToReceiveEventName(this.protocol), (...args) =>
      this.emit("received", ...args)
    );
    for (const event in delegatableEvents) {
      this.socket.on(event, (...args) => {
        this.emit(event, ...args);
      });
    }
  }

  connect(port, address) {
    this.socket.connect(port, address);
  }

  send(data) {
    this.socket[this.sendFnName](data);
  }

  close() {
    this.socket.close();
  }
};
