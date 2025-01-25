const express = require("express");
const app = express();

app.use("/test", (req, res) => {
    res.send("Testing!");
  });

app.use("/secret", (req, res) => {
  res.send("Secret!");
});

app.listen(3199, () => {
  console.log("Hello World!");
});
