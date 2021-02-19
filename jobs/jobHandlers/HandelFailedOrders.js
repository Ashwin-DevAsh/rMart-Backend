var cron = require('node-cron');

var task = cron.schedule('*/15 * * * *', () => {
  console.log("Handling failed orders...")
  (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
});
module.exports = task;