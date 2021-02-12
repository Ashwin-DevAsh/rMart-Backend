var cron = require('node-cron');
 
var task = cron.schedule('*/2 * * * *', () => {
  console.log('running a task every two minutes');
},{ 
    timezone: "Asia/Kolkata"});

module.exports = task;