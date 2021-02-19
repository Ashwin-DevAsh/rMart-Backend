var cron = require('node-cron');

var task = cron.schedule('*/15 * * * *', () => {
  (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
});
module.exports = task;