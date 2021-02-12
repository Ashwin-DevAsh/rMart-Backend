var cron = require('node-cron');
 
var task = cron.schedule('*/2 * * * *', () => {
  console.log('running a task every two minutes');
},{ scheduled: true,
    timezone: "Asia/Kolkata"});

module.exports = task;