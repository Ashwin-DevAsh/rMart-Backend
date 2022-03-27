const app = require("express").Router();
const Auth = require("../Services/Auth");

app.get("/getMerchants", new Auth().isKeyAuth ,(req, res) => {
  res.send([
    {
      ownername: "Admin",
      number: "919840573702",
      email: "kumar@rajalakshmi.edu.in",
      id: "rbusiness@919840573702",
      accountname: "REC CAFE",
    }
  ]);
});

module.exports = app;
