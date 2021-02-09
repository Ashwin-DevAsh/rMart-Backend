const app = require("express").Router();

app.get("/getMerchants", (req, res) => {
  res.send([
    {
      ownername: "Admin",
      number: "919840573702",
      email: "kumar@rajalakshmi.edu.in",
      id: "rbusiness@919840573702",
      accountname: "REC CAFE",
    },
  ]);
});

module.exports = app;
