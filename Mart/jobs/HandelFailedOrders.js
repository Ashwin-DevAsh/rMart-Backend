var cron = require('node-cron');

var task = cron.schedule('*/30 * * * *', () => {
  (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
});
module.exports = task;