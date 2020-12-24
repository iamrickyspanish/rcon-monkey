const protocols = require("../Connection/protocols");

module.exports = {
  connectionProtocol: protocols.UDP,
  // sendPackage: (connection, pkg) => connection.send(), //returns undefined
  // receivePackage: (connection) => null, //returns Package instance
};
