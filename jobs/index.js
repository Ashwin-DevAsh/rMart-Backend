require("dotenv").config({ path: "./env/.env" });
const OrderExpery = require('./jobHandlers/OrderExpery')
require('./jobHandlers/HandelFailedOrders')
require('./jobHandlers/MailHandler')
const HandelFailedAtClose = require('./jobHandlers/HandelFailedAtClose')

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

console.log("Jobs started...")




