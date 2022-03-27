const app = require("express").Router();
const Auth = require("../Services/Auth");

app.get("/getMerchants", new Auth().isKeyAuth ,(req, res) => {
  res.send([
    {
      ownername: "Admin",
      number: "919704755328",
      email: "nagesh@rajalakshmi.edu.in",
      id: "rbusiness@919704755328",
      accountname: "REC CAFE",
    }
  ]);
});

module.exports = app;
