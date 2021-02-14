const app = require("express").Router();
const otpControler = new (require("../Controllers/otpController"))();
const Auth = require("../Services/Auth");
var RateLimit = require('express-rate-limit');

 // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
 
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 15 minutes 
  max: 120, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 

app.post("/getOtp",new Auth().isKeyAuth,limiter ,otpControler.getOtp);

module.exports = app;
