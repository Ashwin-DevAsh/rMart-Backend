var cron = require('node-cron');
 
var task = cron.schedule('30 14 * * *', () => {
  console.log('running a task every two minutes 13 45');
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
    );

module.exports = task;