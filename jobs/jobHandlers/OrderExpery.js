var cron = require('node-cron');
 
var task = cron.schedule('30 16 * * *', () => {
  console.log('Order expering...');
  var currentTime = new Date();
  var currentOffset = currentTime.getTimezoneOffset();
  var ISTOffset = 330; 
  var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
  var day = ISTTime.getDay()

  if(day!=0){
    (new (require('../Services/OrderExpery'))).closeOrder()
  }

},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"
  }
);

module.exports = task;