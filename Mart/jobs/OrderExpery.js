var CronJob=require('cron').CronJob;
var orderExpery = new CronJob({

    cronTime: '00 */3 * * * * ',
    onTick: function () {
      console.log('cron job')
    },
    start: true,
    runOnInit: false
});

module.exports = orderExpery