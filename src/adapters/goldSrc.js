const protocols = require("../Connection/protocols");

module.exports = {
  connectionProtocol: protocols.UDP,
  serialize: (message) => Buffer.concat([
    Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]),
    Buffer.from(message),
    Buffer.from("\n")
  ]),
  parse: (response) => console.log(response)

  // sendPackage: (connection, pkg) => connection.send(), //returns undefined
  // receivePackage: (connection) => null, //returns Package instance
};
