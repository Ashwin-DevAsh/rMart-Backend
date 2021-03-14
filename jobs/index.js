require("dotenv").config({ path: "./env/.env" });
const OrderExpery = require('./jobHandlers/OrderExpery')
require('./jobHandlers/HandelFailedOrders')
const MailHandler = require('./jobHandlers/MailHandler')
const HandelFailedAtClose = require('./jobHandlers/HandelFailedAtClose')
var axios = require('axios');


process.env.TZ = "Asia/Kolkata";

try {
  HandelFailedAtClose.start()  
}catch(e){
  console.log(e);
}

try{
  OrderExpery.start()
}catch(e){
  console.log(e)
}

try{
  for (var i in MailHandler){
    MailHandler[i].start()
  }
}catch(e){
  console.log(e)
}


console.log("Jobs started...")




