const app = require("express").Router();

const registrationController = new (require("../Controllers/RegisterationController"))();

app.post("/signup", registrationController.signup);

app.post("/login", registrationController.login);

app.post("/canLogin", registrationController.canLogin);
module.exports = app;
