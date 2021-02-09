const dateFormat = require("dateformat");
const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

module.exports = class OrderService {
  pool = new Pool(clientDetails);

  placeOrder = async (products, orderdBy, amount) => {
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
            { amount },
            false,
          ]
        )
      ).rows;
      return orderData;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  verifyProducts = (products, amount) => {};
};
