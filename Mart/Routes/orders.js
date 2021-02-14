const app = require("express").Router();
const Auth = require("../Services/Auth");
const OrdersController = require("../Controllers/ordersController");

var ordersController = new OrdersController();

app.post(
  "/makeOrder",
  new Auth().isKeyAuth,
  new Auth().isTransAuth,
  new Auth().isMartOpen,
  ordersController.makeOrder
);

app.post(
  "/verifyPayment",
  new Auth().isKeyAuth,
  new Auth().isAuthenticated,
  ordersController.verifyPayment
);

app.get("/getMyOrders/:id",new Auth().isKeyAuth ,ordersController.getMyOrders);

app.get("/getAllOrders", new Auth().isKeyAuth,ordersController.getAllOrders);

app.get("/getOrderByID/:id", new Auth().isKeyAuth, ordersController.getOrderByID);

app.post("/makeDelivery", new Auth().isKeyAuth, ordersController.makeDelivery);

app.post("/downloadAllPendingOrders", new Auth().isKeyAuth, ordersController.downloadAllPendingOrders);

module.exports = app;
