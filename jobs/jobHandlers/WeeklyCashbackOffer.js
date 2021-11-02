var cron = require('node-cron');
var offerService = new (require('../Services/OfferService'))();

 
var task = cron.schedule('47 11 * * *', async () => {
    console.log("initing cash back offer")
    await offerService.initCashbackOffer()
},{ 
    scheduled: true,
    timezone: "Asia/Kolkata"}
);

module.exports = task;