const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const OrderService = require("../Services/OrderService");
const DatabaseService = require("../Services/Database");
const json2xls = require('json2xls');
const axios = require('axios');
const fs = require("fs")
const QRCode = require("qrcode-svg");
const { v4: uuidv4 } = require('uuid');
var qr = require('qr-image');
const jwt = require("jsonwebtoken");




module.exports = class OrdersController {
  orderservice = new OrderService();
  databaseService = new DatabaseService();
  pool = new Pool(clientDetails);


  placeOrderUsingWallet = async (req, res) => {
    var { products, orderBy, amount } = req.body;

    if(orderBy.id !== jwt.verify(req.get("token"), process.env.PRIVATE_KEY)){
      res.send({ message: "Okay u hacked rMart" })
    }

    if (!products || !orderBy || !amount) {
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
    var orderID = uuidv4()

    var isOrderPlaced = await this.orderservice.placeOrderUsingWallet(
      products,
      orderBy,
      amount,
      orderID
    );


    if (isOrderPlaced.length == 0) {
      console.log("Not Placed");
      res.send({ message: "failed" });
      return;
    }


    res.send({
      message: "success",
      orderID: orderID,
    });
    console.log("finished");
    this.sendMailReport(isOrderPlaced)
    console.log(isOrderPlaced)
    return;
  };


  makeOrder = async (req, res) => {
    var { products, orderBy, amount, walletAmount } = req.body;

    if(!walletAmount){
      walletAmount = 0;
    }

    if (!products || !orderBy || !amount) {
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

    var accountBalance = (await this.orderservice.getBalance(orderBy.id))['balance']
    console.log(accountBalance)
    console.log(walletAmount)

    if(accountBalance < walletAmount){
       console.log("not enough balance")
       res.send({ message: "failed",message:"not enough balance" });
       return
    }

    var orderID = await this.orderservice.getOrderID(
      parseInt(amount) - parseInt(walletAmount),
      orderBy.id
    );

    if (!orderID) {
      res.send({ message: "failed" });
      return;
    }

    var isOrderPlaced = await this.orderservice.placeOrder(
      products,
      orderBy,
      amount,
      walletAmount,
      orderID
    );


    if (isOrderPlaced.length == 0) {
      console.log("Not Placed");
      res.send({ message: "failed" });
      return;
    }


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
      res.send({ message: "invalid body" });
      return;
    }

    var isOrderExist = await this.orderservice.isOrderExist(orderID);

    console.log(isOrderExist)

    if (isOrderExist.length == 0) {
      return;
    }

    var { amount,walletamount,orderdby:{id} } = isOrderExist[0];
    var isverifyRazorpayPayment = await this.orderservice.verifyRazorpayPayment(
      orderID,
      paymentID,
      amount-walletamount
    );

    console.log(isverifyRazorpayPayment);

    if (!isverifyRazorpayPayment) {
      console.log("failed")
      res.send({ message: "failed" });
      return;
    }

    var isUpdated = await this.orderservice.makeOrderValid(orderID,walletamount,id);
    console.log(isUpdated);
    if (isUpdated.length == 0) {
      console.log("failed")
      res.send({ message: "failed" });
      return;
    }

    res.send({ message: "success" });

    this.sendMailReport(isOrderExist)
  };

  sendMailReport = async(isOrderExist)=>{
    try {

      var {amount,orederid,orderdby:{name,number,email},products,qrtoken} = isOrderExist[0]

      var qrcode = qr.image(qrtoken, { type: 'png' });
      qrcode.pipe(fs.createWriteStream(`../QrImages/${qrtoken}.png`)).on('finish',()=>{


        var productString = ``
        for(var i in products){
          console.log(products[i])
            productString += `<tr> 
              <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${products[i].product.productName}</td>
              <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${products[i].count}</td>
              <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${products[i].totalPrice} Rs</td>
            </tr>` 
        } 

        axios.post('http://email:8000/sendMailWithImage',{
          subject:"New Order",
          body:`<p>
                  Order  ${orederid} <br/>
                  Name       ${name} <br/>
                  Email     ${email} <br/>
                  Number   ${number} <br/>
                  Amount   ${amount} Rs<br/><br/><br/>
                  <table style="width:100%;" >
                    <tr>
                      <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Product</th>
                      <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;">Count</th>
                      <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Amount</th>
                    </tr>
                    ${productString}
                  </table>
               </p>`,
         to:'rmart.developers@rajalakshmi.edu.in',
         imageName:`${qrtoken}.png`
        })

        axios.post('http://email:8000/sendMailWithImage',{
          subject:"Order placed successfully!",
          body:`<p>
                  Hey ${name},<br/><br/>
    
                  Your order has been successfully placed ! The Auto-generated QR for collecting your order at the delivery point is attached below.<br/><br/><br/>
               
                  <table style="width:100%;" >
                    <tr>
                      <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Product</th>
                      <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;">Count</th>
                      <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Amount</th>
                    </tr>
                    ${productString}
                  </table><br/><br/><br/>
    
                  Note:<br/>
                  Kindly show this QR code at the delivery point if you face any difficulties in opening the "My Orders" section in the app due to weak network connectivity.
               </p>`,
         to:email,
         imageName:`${qrtoken}.png`
        })

      });

    } catch (error) {
      console.log(error)
    }
  }

  getMyOrders = async (req, res) => {
    var { id, status } = req.params;
    var orders = await this.databaseService.getMyOrders(id,status);
    res.send({ message: "success", orders });
  };

  getAllOrders = async (req, res) => {
    var { id } = req.params;
    var orders = await this.databaseService.getAllOrders();
    res.send({ message: "success", orders });
  };

  getOrderByQr = async(req,res)=>{
    var { id } = req.params;
    var order = await this.databaseService.getOrderByQr(id)
    res.send({ message: "success", order });
  }

  makeDelivery = async (req, res) => {
    var { id } = req.body;
    var {result,object} = await this.databaseService.updateStatus(id);
    if(object){
      var {amount,orederid,orderdby:{name,number,email},products} = object
      var productString = ``
      for(var i in products){
        console.log(products[i])
          productString += `<tr> 
          <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${products[i].product.productName}</td>
          <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${products[i].count}</td>
          <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${products[i].totalPrice} Rs</td>
          </tr>` 
      }
      try {
        axios.post('http://email:8000/sendMail',{
          subject:"New Delivery",
          body:`<p>
                  Order  ${orederid} <br/>
                  Name       ${name} <br/>
                  Email     ${email} <br/>
                  Number   ${number} <br/>
                  Amount   ${amount} Rs<br/><br/><br/>
                  <table style="width:100%;">
                    <tr>
                    <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >product</th>
                    <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >count</th>
                    <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >amount</th>
                    </tr>
                    ${productString}
                  </table>
               </p>`,
         to:'rmart.developers@rajalakshmi.edu.in'
        // to:'2017ashwin@gmail.com'
        })
       } catch (error) {
         console.log(error)
       }
    }
    res.send({ message: result });
  };

  getDeliveredOrders = async (req, res) => {
    var { id } = req.body;
    var result = await this.databaseService.getDeliveredOrders(id);
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
