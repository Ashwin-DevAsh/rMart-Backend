const app = require("express").Router();
const Auth = require("../Services/Auth");
const OrdersController = require("../Controllers/ordersController");

var ordersController = new OrdersController();

app.post(
  "/makeOrder",
  new Auth().isTransAuth,
  // new Auth().isMartOpen,
  ordersController.makeOrder
);

app.post(
  "/verifyPayment",
  new Auth().isAuthenticated,
  ordersController.verifyPayment
);

app.get("/getMyOrders/:id", ordersController.getMyOrders);

app.get("/getAllOrders", ordersController.getAllOrders);

app.get("/getOrderByID", new Auth().isKeyAuth, ordersController.getOrderByID);

app.post("/makeDelivery", new Auth().isKeyAuth, ordersController.makeDelivery);

module.exports = app;
