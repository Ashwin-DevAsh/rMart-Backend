const DatabaseService = require("../Services/DatabaseService");
const jwt = require("jsonwebtoken");

module.exports = class ProfileController {
  databaseService = new DatabaseService();

  getBalance = async (req,res)=>{
      var {id} = req.body;
   
      if(!id){
        res.send({ message: "invalid body" });
        return;
      }
      if(id !== jwt.verify(req.get("token"), process.env.PRIVATE_KEY)){
        res.send({ message: "Okay u hacked rMart" })
      }
      var balance = (await this.databaseService.getBalance(id))["balance"]
      console.log(balance)
      res.send({"message":"done",balance})
  }
} 