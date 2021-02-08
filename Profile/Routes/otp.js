const app = require("express").Router();
const otpControler = new (require("../Controllers/otpController"))();

app.post("/getOtp", otpControler.getOtp);

module.exports = app;
