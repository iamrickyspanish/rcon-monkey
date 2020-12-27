// const { v4: uuidv4 } = require("uuid");

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

// send (type, body) {
// const _id = id || uuidv4();
// const req = createRequest(type, _id, body);
// this.connection.send(req);
// const deferredPromise = new Deferred();
// this.deferredPromises[id] = deferredPromise;
// console.log("sent");
// return deferredPromise.promise;
//}

// receive(response) {
//   const res = readResponse(response);
//   console.log("res", res);
//   const deferredPromise = this.deferredPromises[res.id];
//   if (deferredPromise) {
//     deferredPromise.resolve(res);
//     delete this.deferredPromises[res.id];
//   }
// }
