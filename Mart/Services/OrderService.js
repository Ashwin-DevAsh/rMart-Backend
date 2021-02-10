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

  isOrderExist = async (orderID) => {
    var postgres = await this.pool.connect();
    try {
      var order = (
        await postgres.query(
          `select * from orders where cast(paymentmetadata->>'id' as varchar) = $1`,
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

  getOrderID = async (amount, recpID) => {
    var options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: recpID,
    };
    var orderID = await this.instance.orders.create(options);
    return orderID;
  };

  verifyRazorpayPayment = async (orderID, id, amount) => {
    var postgres = await this.pool.connect();
    try {
      var paymentDetails = await this.instance.payments.fetch(id);
      console.log("Payment Details = ", paymentDetails);
      console.log(
        id,
        paymentDetails.amount / 100,
        amount / 1 + 0.02 * amount,
        id
      );
      console.log(paymentDetails);
      var isVerified =
        (paymentDetails.status == "authorized" ||
          paymentDetails.status == "captured") &&
        paymentDetails.amount / 100 == amount / 1;
      if (isVerified) {
        var data = await postgres.query(
          `update orders set paymentMetadata = $2 where cast(paymentmetadata->>'id' as varchar) = $1 returning *`,
          [orderID, paymentDetails]
        );
        postgres.release();
        return isVerified && data.rows.length > 0;
      } else {
        postgres.release();

        return false;
      }
    } catch (error) {
      postgres.release();

      console.log(error);
      return false;
    }
  };

  makeOrderValid = async (orderID) => {
    var postgres = await this.pool.connect();
    try {
      var order = (
        await postgres.query(
          `update orders set isPaymentSuccessful = true where cast(paymentmetadata->>'order_id' as varchar) = $1 returning *`,
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

  verifyProducts = async (products, amount) => {
    var amountFromDB = 0;
    var productIDS = [];
    var idCountMap = {};
    products.forEach((product) => {
      productIDS.push(product.product.productID);
      idCountMap[product.product.productID] = product.count;
    });

    console.log("product ids = ", productIDS);

    var databaseProduscts = await this.getProductsWithIDS(productIDS);

    var isValidProduct = databaseProduscts.length == productIDS.length;
    if (!isValidProduct) {
      return "invalid product";
    }

    databaseProduscts.forEach((dbProduct) => {
      var amount = dbProduct.amount;
      amountFromDB += amount * idCountMap[dbProduct.productID];
    });

    console.log(`actual amount = ${amount} amount from db = ${amountFromDB}`);

    isValidAmount = amount == amountFromDB;
    if (!isValidAmount) {
      return "invalid product";
    }

    return "veified";
  };

  getProductsWithIDS = async (ids) => {
    var postgres = await this.pool.connect();
    var idsString = ids.toString().replace("[", "(").replace(")", "]");
    try {
      var products = (
        await postgres.query(
          `select * from products where productID in ${idsString} and isAvaliable = true`,
          [ids]
        )
      ).rows;
      postgres.release();
      return products;
    } catch (e) {
      postgres.release();
      console.log(e);
      return [];
    }
  };
};
