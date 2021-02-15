var cron = require('node-cron');

var task = cron.schedule('*/1 * * * *', () => {
  console.log('running a task every two minutes');
  (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
});
module.exports = task;