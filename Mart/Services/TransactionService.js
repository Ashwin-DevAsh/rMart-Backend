const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const Razorpay = require("razorpay");
const dateFormat = require("dateformat");



module.exports = class TransactionService {
  pool = new Pool(clientDetails);
  instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
  });

  createAddMoneyOrder = async(amount,toMetadata,fromMetadata) =>{
    var postgres = await this.pool.connect();
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330; 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    var transactionTime = dateFormat(ISTTime, "mm-dd-yyyy hh:MM:ss");

    try {
      var orderData = (
        await postgres.query(
          `insert into transactions(
                        transactionType,
                        amount,
                        fromMetadata ,
                        toMetadata,
                        timestamp,
                        isPaymentSuccessful
                        )
                        values($1,$2,$3,$4,$5,$6) returning *`,
          [
            "ADDING_MONEY",
            amount,
            fromMetadata,
            toMetadata,
            transactionTime,
            false,
          ]
        )
      ).rows;
      postgres.release();
      return orderData;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  } 

  getOrderID = async (amount, recpID) => {
    var options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: recpID,
    };
    var orderID = await this.instance.orders.create(options);
    return orderID;
  };
};
