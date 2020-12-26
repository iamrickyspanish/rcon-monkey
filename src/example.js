const RconClient = require("./Client");
const GoldSrcAdapter = require("./adapters/goldSrc");

const client = new RconClient(new GoldSrcAdapter(), 27015, "frag.world");

client
  .authenticate("gungerskunk")
  .then((res) => {
    console.log("authenticated", res);
  })
  .catch((e) => {
    console.error("error", e);
  });
