const app = require("express").Router();
const otpControler = new (require("../Controllers/otpController"))();
const Auth = require("../Services/Auth");

app.post("/getOtp",new Auth().isKeyAuth ,otpControler.getOtp);

module.exports = app;
