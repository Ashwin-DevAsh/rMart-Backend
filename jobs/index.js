require("dotenv").config({ path: "./env/.env" });
const OrderExpery = require('./jobHandlers/OrderExpery')
const handelFailedOrders = require('./jobHandlers/HandelFailedOrders')
const MailHandler = require('./jobHandlers/MailHandler')
const HandelFailedAtClose = require('./jobHandlers/HandelFailedAtClose')
const WeeklyCashbackOffer = require('./jobHandlers/WeeklyCashbackOffer')
const handelFailedTransactions = require('./jobHandlers/HandelFailedTransactions')
const deleteUnwantedData = require('./jobHandlers/DeleteUnwantedData')





process.env.TZ = "Asia/Kolkata";

try {
  handelFailedTransactions.start()  
}catch(e){
  console.log(e);
}

try {
  deleteUnwantedData.start()  
}catch(e){
  console.log(e);
}


try {
  handelFailedOrders.start()  
}catch(e){
  console.log(e);
}

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
  WeeklyCashbackOffer.start()
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




