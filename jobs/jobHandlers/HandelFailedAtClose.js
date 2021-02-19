var cron = require('node-cron');
 
var task = cron.schedule('5 21 * * *', () => {
    console.log("Handling failed orders At close...")
    (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;