const app = require("express").Router();
const recoveryController = new (require("../Controllers/recoveryController"))();
const Auth = require("../Services/Auth");

app.post("/getRecoveryOtp", new Auth().isKeyAuth ,recoveryController.getRecoveryOtp);
app.post("/verifyRecoveryOtp", new Auth().isKeyAuth ,recoveryController.verifyRecoveryOtp);
app.post("/changePassword", new Auth().isKeyAuth ,recoveryController.changePassword);

module.exports = app;
