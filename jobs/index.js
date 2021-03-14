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

setInterval(
  ()=>{
    axios.post('http://email:8000/sendNotification',{
      title:"Hurry up!",
      subtitle:"The sale for tomorrow's meal will be closing tonight!",
      topic:'rMart'
    })
  },
  6000
)


console.log("Jobs started...")




