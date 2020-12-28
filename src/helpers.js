const createRequest = (type, id, body) => {
  var size = Buffer.byteLength(body) + 14,
    buffer = new Buffer.alloc(size);

  buffer.writeInt32LE(size - 4, 0);
  buffer.writeInt32LE(id, 4);
  buffer.writeInt32LE(type, 8);
  buffer.write(body, 12, size - 2, "ascii");
  buffer.writeInt16LE(0, size - 2);

  return buffer;
};

const readResponse = (buffer) => {
  var response = {
    size: buffer.readInt32LE(0),
    id: buffer.readInt32LE(4),
    type: buffer.readInt32LE(8),
    body: buffer.toString("ascii", 12, data.length - 2),
  };

  return response;
};

module.exports = {
  createRequest,
  readResponse,
};
