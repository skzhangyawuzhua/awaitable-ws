const path = require("node:path");

const express = require("express");

const app = express();

const port = 2222;

app.use(express.static(path.resolve(__dirname, "../../dist/esm")));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(`${__dirname}/index.html`);
});

const server = app.listen(port, function () {
  console.log("web已启动 " + port);
});
