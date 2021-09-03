"use strict";

const Adapter = require("../../Adapter");
const { UDP } = require("../../Connection/protocols");
// const responseTypes = require("./responseTypes");
const headers = require("./headers");

const END_OF_CONTENT = 0x00;

const mapMessageToChallenge = (message) => {
  try {
    return message.substr(0, message.indexOf("\n")).split(" ").pop();
  } catch (e) {
    throw new Error("parsing challenge: invalid message");
  }
};

const deconstructResponseBuffer = (buffer) => {
  const sliceArgs = [headers.CONNECTIONLESS.length];
  const iEnd = buffer.indexOf(END_OF_CONTENT);
  if (iEnd !== -1) sliceArgs.push(iEnd);
  const withoutHeader = buffer.slice(...sliceArgs);
  return [
    withoutHeader.slice(0, 1).toString(),
    withoutHeader.slice(1).toString()
  ];
};

module.exports = class GoldSrcAdapter extends Adapter {
  constructor(...args) {
    super(...args);
    this.challege = null;
    this.password = null;
  }

  getProtocol() {
    return UDP;
  }

  async authenticate(sendFn, password) {
    const responseChallenge = await sendFn("challenge rcon");
    this.challenge = mapMessageToChallenge(responseChallenge);
    const responseEcho = await sendFn(
      `rcon ${this.challege} ${password} echo rcon-monkey: Test`
    );
    this.password = password;
    console.log("!!!!!!", responseEcho);
    return true;
  }

  prepareMessageForSend(message) {
    if (message.startsWith("challenge")) {
      return message;
    } else if (this.challenge && this.password) {
      return `rcon ${this.challenge} ${this.password} ${message}`;
    } else {
      return message; // TODO: not "logged in" error
    }
  }

  serialize(message) {
    const preparedMessage = this.prepareMessageForSend(message);
    return Buffer.concat([
      Buffer.from(headers.CONNECTIONLESS),
      Buffer.from(preparedMessage),
      Buffer.from("\n")
    ]);
  }

  parse(buffer) {
    try {
      const [type, message] = deconstructResponseBuffer(buffer);
      // console.log("type", type);
      // if (type !== responseTypes.PRINT) {
      //   console.debug("NOT PRINT", message);
      // } else {
      //   console.log("PRINT", `|${message}|`);
      // }
      return message;
    } catch (err) {
      throw new Error("Invalid response format: " + err);
    }
  }
};
