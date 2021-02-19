var cron = require('node-cron');
 
var task = cron.schedule('5 21 * * *', () => {
    console.log("Handling failed orders...")
    (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;