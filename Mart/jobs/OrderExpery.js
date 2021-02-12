var cron = require('node-cron');
 
var task = cron.schedule('30 00 * * *', () => {
  console.log('Order expering...');
  (new (require('./Services/OrderExpery'))).closeOrder()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;