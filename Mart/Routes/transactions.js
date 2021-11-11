const app = require("express").Router();
const Auth = require("../Services/Auth");
const TransactionController = require("../Controllers/TransactionController");
var json2xls = require('json2xls');

var transactionController = new TransactionController();

app.post(
  "/makeOrder",
  new Auth().isKeyAuth,
  new Auth().isAddMoneyAuth,
  transactionController.createAddMoneyOrder
);

module.exports = app