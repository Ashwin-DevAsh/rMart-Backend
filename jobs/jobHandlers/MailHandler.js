var cron = require('node-cron');

var task = cron.schedule('*/1 * * * *', () => {
  console.log("Handling failed orders...")
});
module.exports = task;