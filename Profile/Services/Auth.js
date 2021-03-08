const jwt = require("jsonwebtoken");
const databaseService = new (require('../Services/DatabaseService'))();

module.exports = class Auth {

  

  isKeyAuth = async (req, res, next) => {
    try {
      var isVerified = process.env.PRIVATE_KEY == req.get("key") || process.env.MART_SERVER_KEY==req.get("key");
      if (isVerified) {
        console.log("Verified...")
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
};
