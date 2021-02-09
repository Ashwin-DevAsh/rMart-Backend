const app = require("express").Router();
const recoveryController = new (require("../Controllers/recoveryController"))();

app.post("/getRecoveryOtp", recoveryController.getRecoveryOtp);

module.exports = app;
