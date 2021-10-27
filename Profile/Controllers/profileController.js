const DatabaseService = require("../Services/DatabaseService");

module.exports = class ProfileController {
  databaseService = new DatabaseService();

  getBalance = async (req,res)=>{
      var {id} = req.body;
      var {headerID} = req.headers
      if(!id){
        res.send({ message: "invalid body" });
        return;
      }
      if(id !== headerID){
        res.send({ message: "Okay you hacked rMart" });
      }
      console.log(headerID)
      var balance = (await this.databaseService.getBalance(id))["balance"]
      console.log(balance)
      res.send({"message":"done",balance})
  }
} 