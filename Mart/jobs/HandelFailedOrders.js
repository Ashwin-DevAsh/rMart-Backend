var cron = require('node-cron');

var task = cron.schedule('*/2 * * * *', () => {
  console.log('running a task every two minutes');
  (new (require('../Services/HandelFailedOrdersService'))).handleFailedOrders()
});
module.exports = task;