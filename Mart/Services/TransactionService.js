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

  addMoney = async (orderID,amount,id) => {
    var postgres = await this.pool.connect();
    try {
      await postgres.query("begin");
      var user = (
        await postgres.query("select * from users where id=$1 for update", [id])
      ).rows[0];  
      console.log("user = ",user)
      if(!user){
        throw Error("Invalid User")
      }

      await postgres.query(
        "update users set balance = balance + $1 where id = $2",
        [amount, id]
      );
      var order = (
        await postgres.query(
          `update transactions set isPaymentSuccessful = true where cast(fromMetadata->>'order_id' as varchar) = $1 returning *`,
          [orderID]
        )
      ).rows;
      await postgres.query("commit");
      postgres.release();
      return order;
    } catch (e) {
      await postgres.query("rollback");
      postgres.release();
      console.log(e);
      return [];
    }
  };

  getOrderID = async (amount, recpID) => {
    var options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: recpID,
    };
    var orderID = await this.instance.orders.create(options);
    return orderID;
  };

  isAddMoneyOrderExist = async (orderID) => {
    var postgres = await this.pool.connect();
    try {
      var order = (
        await postgres.query(
          `select * from transactions where cast(fromMetadata->>'id' as varchar) = $1`,
          [orderID]
        )
      ).rows;
      postgres.release();

      return order;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };



  verifyRazorpayPayment = async (orderID, id, amount) => {
    var postgres = await this.pool.connect();
    try {
      var paymentDetails = await this.instance.payments.fetch(id);
      console.log(paymentDetails);
      var isVerified =
        (paymentDetails.status == "authorized" || paymentDetails.status == "captured") && paymentDetails.amount / 100 == amount / 1;
      if (isVerified) {
        var data = await postgres.query(
          `update transactions set fromMetadata = $2 where cast(fromMetadata->>'id' as varchar) = $1 returning *`,
          [orderID, paymentDetails]
        );
        postgres.release();
        if(data.rows.length > 0){
          return paymentDetails.amount / 100
        }else{
          return 0
        }
      } else {
        postgres.release();
        return 0;
      }
    } catch (error) {
      postgres.release();
      console.log(error);
      return 0;
    }
  };
};
