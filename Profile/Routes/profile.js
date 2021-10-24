const app = require("express").Router();
const Auth = require("../Services/Auth");

const profileController = new (require("../Controllers/profileController"))();

app.post("/getBalance", new Auth().isKeyAuth, new Auth().isAuthenticated ,profileController.getBalance);



module.exports = app;
