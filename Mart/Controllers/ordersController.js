const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const OrderService = require("../Services/OrderService");
const DatabaseService = require("../Services/Database");

module.exports = class OrdersController {
  orderservice = new OrderService();
  databaseService = new DatabaseService();
  pool = new Pool(clientDetails);
  makeOrder = async (req, res) => {
    var { products, orderBy, amount } = req.body;

    if (!products || !orderBy || !amount) {
      console.log("Invalid body");
      res.send({ message: "failed" });
      return;
    }

    var isOrderPlaced = await this.orderservice.placeOrder(
      orderBy,
      products,
      amount
    );

    if (isOrderPlaced.length == 0) {
      console.log("failed");
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
