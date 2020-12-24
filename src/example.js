const RconClient = require("./Client");
const goldSrcAdapter = require("./adapters/goldSrc");

const client = new RconClient(goldSrcAdapter, 27015, "frag.world");

client
  .authenticate("gungerskunk")
  .then((res) => {
    console.log("authenticated", res);
  })
  .catch((e) => {
    console.error("error", e);
  });
