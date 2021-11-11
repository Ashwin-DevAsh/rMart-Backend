var cron = require('node-cron');
var deleteUnwantedData = new (require('../Services/DeleteUnwantedData'))();

 
var task = cron.schedule('0 2 * * *', async () => {
    console.log("deleteing unwanted data")
    await deleteUnwantedData.deleteUnwantedData()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;