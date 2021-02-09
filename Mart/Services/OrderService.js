const dateFormat = require("dateformat");
const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const Razorpay = require("razorpay");

module.exports = class OrderService {
  pool = new Pool(clientDetails);

  instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
  });

  placeOrder = async (products, orderdBy, amount, paymentMetadata) => {
    var postgres = await this.pool.connect();
    var transactionTime = dateFormat(new Date(), "mm-dd-yyyy hh:MM:ss");
    try {
      var orderData = (
        await postgres.query(
          `insert into orders(
                        status,
                        amount,
                        orderdBy ,
                        timestamp ,
                        products ,
                        paymentMetadata,
                        isPaymentSuccessful)
                        values($1,$2,$3,$4,$5,$6,$7) returning *`,
          [
            "pending",
            amount,
            orderdBy,
            transactionTime,
            products,
            paymentMetadata,
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
  };

  getOrderID = async (amount) => {
    var options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
    };
    var orderID = await this.instance.orders.create(options);
    return orderID;
  };

  verifyGateway = async (id, amount) => {
    try {
      var paymentDetails = await instance.payments.fetch(id);
      console.log("Payment Details = ", paymentDetails);
      console.log(
        id,
        paymentDetails.amount / 100,
        amount / 1 + 0.02 * amount,
        id
      );
      return (
        paymentDetails.status == "authorized" &&
        paymentDetails.amount / 100 == amount / 1 + 0.02 * amount
      );
    } catch (error) {
      return false;
    }
  };

  verifyProducts = (products, amount) => {};
};
