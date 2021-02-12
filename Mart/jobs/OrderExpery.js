var cron = require('node-cron');
 
var task = cron.schedule('05 16 * * *', () => {
  console.log('Order expering...');
  (new (require('../Services/OrderExpery'))).closeOrder()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;