const app = require("express").Router();

app.get("/getMerchants", (req, res) => {
  res.send([
    {
      id: "rbusiness@919840573702",
      name: "rec cafe",
    },
  ]);
});

module.exports = app;
