const jwt = require("jsonwebtoken");

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
    var currentHour = new Date().getHours();
    if (currentHour > 11 && currentHour < 21) {
      next();
    } else {
      res.send({ message: "closed" });
    }
  };
};
