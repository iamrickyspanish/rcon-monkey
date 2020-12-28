module.exports = class Package {
  constructor(type, body, id) {
    Object.assign(this, { type, body, id });
    Object.freeze(this);
  }
};
