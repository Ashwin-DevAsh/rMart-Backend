const app = require("express").Router();
const Auth = require("../Services/Auth");

const registrationController = new (require("../Controllers/RegisterationController"))();

app.post("/signup", new Auth().isKeyAuth ,registrationController.signup);

app.post("/login", new Auth().isKeyAuth ,registrationController.login);

app.post("/canLogin", new Auth().isKeyAuth ,registrationController.canLogin);
module.exports = app;
