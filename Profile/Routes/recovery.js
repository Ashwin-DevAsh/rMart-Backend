const app = require("express").Router();
const recoveryController = new (require("../Controllers/recoveryController"))();

app.post("/getRecoveryOtp", recoveryController.getRecoveryOtp);
app.post("/verifyRecoveryOtp", recoveryController.verifyRecoveryOtp);
app.post("/changePassword", recoveryController.changePassword);

module.exports = app;
