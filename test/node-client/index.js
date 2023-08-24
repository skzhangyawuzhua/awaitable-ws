const awaitableWs = require("../../dist/cjs").default;

const url = "ws://127.0.0.1:6000";

const openFn = () => {
  console.log("on open");
};

const main = async () => {
  const ws = new awaitableWs({ url, openFn });

  //wait server back by promise
  const res = await ws.send({ arg1: "arg1" });

  console.log(res);
};

main();
