const jwt = require("jsonwebtoken");
const dateFormat = require("dateformat");
const moment = require("moment-timezone");



module.exports = class Auth {
  isAuthenticated = async (req, res, next) => {
    try {
      var id = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY).id;
      next();
    } catch (e) {
      console.log(e);
      res.send({ message: "error" });
      return;
    }
  };

  isTransAuth = async (req, res, next) => {
    try {
      console.log("TransAuth");
      var decoded = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
      if (decoded.number != req.body.orderBy.number) {
        console.log(decoded.number, req.body.orderBy.number);
        res.send({ message: "failed" });
        return;
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "failed" });
      return;
    }
    next();
  };

  isKeyAuth = async (req, res, next) => {
    try {
      console.log("key ver");
      var isVerified = process.env.PRIVATE_KEY == req.get("key");
      if (isVerified) {
        next();
      } else {
        res.send({ message: "failed" });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "failed" });
      return;
    }
  };

  isMartOpen = async (req, res, next) => {

    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330; 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    console.log("Mart time = ",ISTTime.getHours()," ",ISTTime.getMinutes())


    var currentHour = ISTTime.getHours() //new Date().getHours();
    if (currentHour >= 12 && currentHour < 21) {
      next();
    } else {
      res.send({ message: "closed" });
    }
  };
};
