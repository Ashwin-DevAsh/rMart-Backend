const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const OrderService = require("../Services/OrderService");
const DatabaseService = require("../Services/Database");
var json2xls = require('json2xls');


module.exports = class OrdersController {
  orderservice = new OrderService();
  databaseService = new DatabaseService();
  pool = new Pool(clientDetails);

  makeOrder = async (req, res) => {
    var { products, orderBy, amount } = req.body;

    if (!products || !orderBy || !amount) {
      console.log("Invalid body");
      res.send({ message: "invalid body" });
      return;
    }

    var isValidProduct = await this.orderservice.verifyProducts(
      products,
      amount
    );
    if (isValidProduct != "veified") {
      res.send({ message: isValidProduct });
      return;
    }
    var orderID = await this.orderservice.getOrderID(
      parseInt(amount),
      orderBy.id
    );

    if (!orderID) {
      console.log("unable to place order");
      res.send({ message: "failed" });
      return;
    }

    var isOrderPlaced = await this.orderservice.placeOrder(
      products,
      orderBy,
      amount,
      orderID
    );

    console.log("isProductPlaced ", isOrderPlaced);

    if (isOrderPlaced.length == 0) {
      console.log("Not Placed");
      res.send({ message: "failed" });
      return;
    }

    console.log(("order id ", orderID));

    res.send({
      message: "done",
      order: isOrderPlaced,
      orderID: orderID.id,
      key_id:process.env.key_id,
      signature: "",
    });
    console.log("finished");
    return;
  };

  verifyPayment = async (req, res) => {
    var { orderID, paymentID } = req.body;
    if (!orderID || !paymentID) {
      console.log("Invalid body");
      res.send({ message: "invalid body" });
      return;
    }

    var isOrderExist = await this.orderservice.isOrderExist(orderID);

    if (isOrderExist.length == 0) {
      res.send({ message: "order not exist" });
      return;
    }

    var { amount } = isOrderExist[0];
    var isverifyRazorpayPayment = await this.orderservice.verifyRazorpayPayment(
      orderID,
      paymentID,
      amount
    );

    if (!isverifyRazorpayPayment) {
      console.log("not verified in raz");
      res.send({ message: "failed" });
      return;
    }

    var isUpdated = await this.orderservice.makeOrderValid(orderID);
    if (isUpdated.length == 0) {
      console.log("unable to update");
      res.send({ message: "failed" });
      return;
    }

    res.send({ message: "success" });
    console.log("finished ver");
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

  getOrderByID = async(req,res)=>{
    var { id } = req.params;
    var order = await this.databaseService.getOrderByID(id)
    res.send({ message: "success", order });
  }

  makeDelivery = async (req, res) => {
    var { id } = req.body;
    var result = await this.databaseService.updateStatus(id);
    res.send({ message: result });
  };

  downloadAllPendingOrders = async (req, res) => {
    var result = await this.databaseService.getAllPendingOrders();
    var  ordersMap = {}
    var  orders = [] 
    result.forEach(({products})=>{
      products.forEach(({product,totalPrice,count})=>{
        var productID = product.productID;
        try{
          ordersMap[productID].productName=product.productName;
          ordersMap[productID].count+=count
          ordersMap[productID].totalPrice+=totalPrice
        }catch(e){
          ordersMap[productID] = {
            productName : product.productName,
            count : count,
            totalPrice:totalPrice
          }
        }
      })
    })
    for(var i in ordersMap){
      orders.push(ordersMap[i])
    }

    res.xls('orders.xlsx', orders);
  };
};
