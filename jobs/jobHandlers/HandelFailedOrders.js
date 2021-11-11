var cron = require('node-cron');

var task = cron.schedule('*/5 * * * *', () => {
  (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
});
module.exports = task;