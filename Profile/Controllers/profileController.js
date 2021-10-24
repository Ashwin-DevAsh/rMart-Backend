const DatabaseService = require("../Services/DatabaseService");

module.exports = class ProfileController {
  databaseService = new DatabaseService();

  getBalance = async (req,res)=>{
      var {id} = req.body;
      if(!id){
        res.send({ message: "invalid body" });
        return;
      }
      var balance = this.databaseService.getBalance(id)
      console.log(balance)
      res.send({"message":"done",balance})
  }
} 