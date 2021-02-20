const jwt = require("jsonwebtoken");

module.exports = class Auth {

  isKeyAuth = async (req, res, next) => {
    try {
      console.log("key ver");
      var isVerified = process.env.PRIVATE_KEY == req.get("key") || process.env.MART_SERVER_KEY==req.get("key");
      if (isVerified) {
        next();
      } else {
        console.log("failed")
        res.send({ message: "failed" });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "failed" });
      return;
    }
  };
};
