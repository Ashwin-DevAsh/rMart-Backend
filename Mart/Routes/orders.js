const app = require("express").Router();
const Auth = require("../Services/Auth");
const OrdersController = require("../Controllers/ordersController");
var json2xls = require('json2xls');

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

app.get("/getMyOrders/:id",new Auth().isKeyAuth,  new Auth().isAuthenticated ,ordersController.getMyOrders);

app.get("/getAllOrders", new Auth().isKeyAuth,ordersController.getAllOrders);

app.get("/getQrToken/:id", new Auth().isMerchantKeyAuth, ordersController.getOrderByQr);

app.post("/makeDelivery", new Auth().isMerchantKeyAuth, ordersController.makeDelivery);

app.get("/getDeliveredOrders", new Auth().isMerchantKeyAuth, ordersController.getDeliveredOrders);

app.get("/downloadAllPendingOrders", new Auth().isKeyAuth, json2xls.middleware , ordersController.downloadAllPendingOrders);

module.exports = app;
