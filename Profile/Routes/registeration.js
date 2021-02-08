const app = require("express").Router();

const registrationController = new (require("../Controllers/RegisterationController"))();

app.post("/signup", registrationController.signup);

module.exports = app;
