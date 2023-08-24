const WebSocket = require("ws");

const port = 6000;

const wss = new WebSocket.Server({ port, host: "127.0.0.1" });

console.log(`ws server start on ${port}`);

wss.on("connection", (ws, request, rep) => {
  console.log("server recv connection");

  // const allowedOrigins = ["http://127.0.0.1:8081", "http://localhost:8081"];
  // const origin = request.headers.origin;

  // ws.on("headers", headers => {
  //   headers.push("Access-Control-Allow-Origin: *");
  // });

  ws.on("message", bufferMsg => {
    const msg = bufferMsg.toString(); // JSON.parse(msg);

    let data = msg;

    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.log(e);
    }

    if (data === "ping") {
      ws.send("pong");
      return;
    }

    ws.send(JSON.stringify({ id: data.id, msg: "服务端返回" }));
  });
});