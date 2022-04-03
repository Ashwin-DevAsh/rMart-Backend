const jwt = require("jsonwebtoken");
const databaseService = new (require('../Services/Database'))();

module.exports = class Auth {
  isAuthenticated = async (req, res, next) => {
    try {
      var id = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY).id;
      var user = await databaseService.getUserWithID(id)
      if(user.length==0){
        res.send({ message: "error" });
      }else{
        next();
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "error" });
      return;
    }
  };

  isOrderAuth = async (req, res, next) => {
    try {
      var decoded = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
      if (decoded.id != req.body.orderBy.id) {
        console.log(decoded.id, req.body.orderBy.id);
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

  isAddMoneyAuth = async (req, res, next) => {
    try {
      var decoded = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
      if (decoded.id != req.body.toMetadata.id) {
        console.log(decoded.id, req.body.orderBy.id);
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
      var isVerified = process.env.PRIVATE_KEY == req.get("key") || process.env.MART_SERVER_KEY==req.get("key");
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

  isMerchantKeyAuth = async (req, res, next) => {
    try {
      var isVerified = process.env.PRIVATE_KEY == req.get("key") || process.env.MERCHANT_SERVER_KEY==req.get("key");
      if (isVerified) {
        next();
      } else {
        console.log("invalid auth",req.get("key"))
        res.send({ message: "failed" });
      }
    } catch (e) {
      console.log(e,req.get("key"));
      res.send({ message: "failed" });
      return;
    }
  };

  isMartOpen = async (req, res, next) => {
    next()
  };
};
