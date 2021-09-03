const RconClient = require("./Client");
const GoldSrcAdapter = require("./adapters/goldSrc");

const exec = async () => {
  try {
    const client = new RconClient(
      new GoldSrcAdapter(),
      27015,
      "panel.frag.world"
    );
    await client.authenticate("affe");
    await client.exec("say jogger");
    console.log("a", await client.exec("status"));
  } catch (e) {
    console.error("error", e);
  }
};

exec();
