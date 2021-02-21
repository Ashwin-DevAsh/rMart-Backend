const app = require("express").Router();
const Auth = require("../Services/Auth");

const registrationController = new (require("../Controllers/RegisterationController"))();

app.post("/signup", new Auth().isKeyAuth ,registrationController.signup);

app.post("/login", new Auth().isKeyAuth ,registrationController.login);

app.post("/canLogin", new Auth().isKeyAuth ,registrationController.canLogin);

app.post("/checkKeys", new Auth().isKeyAuth ,new Auth().isAuthenticated,(req,res)=>{req.send({"message":"success"})});
module.exports = app;
