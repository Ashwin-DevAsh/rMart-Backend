const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const TransactionService = require("../Services/TransactionService");
const DatabaseService = require("../Services/Database");
const axios = require('axios');
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
var qr = require('qr-image');




module.exports = class TransactionController {
    transactionService = new TransactionService();
    databaseService = new DatabaseService();
    pool = new Pool(clientDetails);

    createAddMoneyOrder = async (req, res) => {
        var { amount, toMetadata } = req.body;
  
        if (!toMetadata || !amount) {
          res.send({ message: "invalid body" });
          return;
        }

    
        var order = await this.transactionService.getOrderID(
          amount,
          toMetadata.id
        );
    
        if (!order) {
          res.send({ message: "failed" });
          return;
        }
    
        var isOrderPlaced = await this.transactionService.createAddMoneyOrder(
          amount,
          toMetadata,
          order
        );
    
    
        if (isOrderPlaced.length == 0) {
          console.log("Not Placed");
          res.send({ message: "failed" });
          return;
        }
    
    
        res.send({
          message: "done",
          order: isOrderPlaced,
          orderID: order.id,
          key_id:process.env.key_id,
          signature: "",
        });
        console.log("finished");
        return;
    };


    addMoney = async (req, res) => {
      var { orderID, paymentID } = req.body;
      if (!orderID || !paymentID) {
        res.send({ message: "invalid body" });
        return;
      }
  
      var isOrderExist = await this.transactionService.isAddMoneyOrderExist(orderID);
  
      console.log(isOrderExist)
  
      if (isOrderExist.length == 0) {
        return;
      }
  
      var { amount,orderdby:{id} } = isOrderExist[0];
      var isverifyRazorpayPayment = await this.transactionService.verifyRazorpayPayment(
        orderID,
        paymentID,
        amount
      );
  
      console.log(isverifyRazorpayPayment);
  
      if (!isverifyRazorpayPayment) {
        console.log("failed")
        res.send({ message: "failed" });
        return;
      }
  
      var isUpdated = await this.transactionService.addMoney(orderID,amount,id);
      console.log(isUpdated);
      if (isUpdated.length == 0) {
        console.log("failed")
        res.send({ message: "failed" });
        return;
      }
  
      res.send({ message: "success" });
  
      this.sendMailReport(isOrderExist)
    };
  
  
}  