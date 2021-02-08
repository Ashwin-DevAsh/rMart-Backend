const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const TransactionsService = require("../Services/TransactionService");
const DatabaseService = require("../Services/Database");
const jwt = require("jsonwebtoken");

module.exports = class OrdersController {
  transactionsService = new TransactionsService();
  databaseService = new DatabaseService();
  pool = new Pool(clientDetails);
  makeOrder = async (req, res) => {
    var { products, transactionData, amount } = req.body;

    if (!products || !transactionData || !amount) {
      console.log("Invalid body");
      res.send({ message: "failed" });
      return;
    }

    var isOrderPlaced = await this.transactionsService.makeOrder(
      transactionData,
      products,
      amount
    );

    if (!isOrderPlaced) {
      console.log("payment failed");
      res.send({ message: "failed" });
      return;
    }

    res.send({ message: "done", order: isOrderPlaced });
    return;
  };

  getMyOrders = async (req, res) => {
    var { id } = req.params;
    var orders = await this.databaseService.getMyOrders(id);
    res.send({ message: "success", orders });
  };

  getAllOrders = async (req, res) => {
    var { id } = req.params;
    var orders = await this.databaseService.getAllOrders();
    res.send({ message: "success", orders });
  };

  makeDelivery = async (req, res) => {
    var { id } = req.body;
    var result = await this.databaseService.updateStatus(id);
    res.send({ message: result });
  };
};
