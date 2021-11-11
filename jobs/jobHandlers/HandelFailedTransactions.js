var cron = require('node-cron');

var task = cron.schedule('*/10 * * * *', () => {
  (new (require('../Services/FailedTransactionService'))).handleFailedAddMoneyOrders()
});
module.exports = task;