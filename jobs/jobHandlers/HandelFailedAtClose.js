var cron = require('node-cron');
 
var task = cron.schedule('5 23 * * *', () => {
    (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;