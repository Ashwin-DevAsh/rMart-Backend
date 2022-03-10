const app = require("express").Router();
const Auth = require("../Services/Auth");
const OrdersController = require("../Controllers/ordersController");
var json2xls = require('json2xls');

var ordersController = new OrdersController();

app.post(
  "/makeOrder",
  new Auth().isKeyAuth,
  new Auth().isOrderAuth,
  new Auth().isMartOpen,
  ordersController.makeOrder
);

app.post(
  "/makeOrderUsingWalletAndRazorpay",
  new Auth().isKeyAuth,
  new Auth().isOrderAuth,
  new Auth().isMartOpen,
  ordersController.makeOrder
);

app.post(
  "/placeOrderUsingWallet",
  new Auth().isKeyAuth,
  new Auth().isOrderAuth,
  new Auth().isMartOpen,
  ordersController.placeOrderUsingWallet
);

app.post(
  "/verifyPayment",
  new Auth().isKeyAuth,
  new Auth().isAuthenticated,
  ordersController.verifyPayment
);

app.get("/getMyOrders/:id",new Auth().isKeyAuth ,ordersController.getMyOrders);
app.get("/v2/getMyOrders/:id/:status",new Auth().isKeyAuth ,ordersController.getMyOrders);


app.get("/getAllOrders", new Auth().isMerchantKeyAuth,ordersController.getAllOrders);

app.get("/getQrToken/:id", new Auth().isMerchantKeyAuth, ordersController.getOrderByQr);

app.post("/makeDelivery", new Auth().isMerchantKeyAuth, ordersController.makeDelivery);

app.post("/makePartialDelivery", new Auth().isMerchantKeyAuth, ordersController.makePartialDelivery);

app.get("/getDeliveredOrders", new Auth().isMerchantKeyAuth, ordersController.getDeliveredOrders);

app.get("/downloadAllPendingOrders", new Auth().isMerchantKeyAuth, json2xls.middleware , ordersController.downloadAllPendingOrders);

module.exports = app;
