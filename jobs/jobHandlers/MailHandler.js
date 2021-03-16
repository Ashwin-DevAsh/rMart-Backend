var cron = require('node-cron');
var axios = require('axios');

var task1 = cron.schedule('00 22 * * *', () => {
    try{

      var currentTime = new Date();
      var currentOffset = currentTime.getTimezoneOffset();
      var ISTOffset = 330; 
      var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
      var day = ISTTime.getDay()

      if(day!=6){
          // axios.post('http://email:8000/sendNotification',{
          //   title:"Closing soon!",
          //   subtitle:"The order requests for tomorrow's sale is closing in an hour!",
          //   topic:'rMart'
          // })
      }
       console.log("sended email")
    }catch(e){
      console.log(e)
    }
},
{ 
  scheduled: true,
  timezone: "Asia/Kolkata"
}
);



var task2 = cron.schedule('00 12 * * *', () => {
  try{

    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330; 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    var day = ISTTime.getDay()

    // if(day!=6){
    //   axios.post('http://email:8000/sendMail',{
    //     subject:"Open now! Sale for tomorrow's meal is live now!",
    //     body:`<p>Hey!<br><br>
    //     The sale for tomorrow's meal is open now! Order safe and hygiene meals  from restaurants at our campus.<br><br>
        
    //     The sale will be open till 11:00 PM tonight.<br><br>
        
    //     Feel free to drop your suggestion/queries /bug report @ rmart.support@rajalakshmi.edu.in<br><br>

    //     Download app from https://play.google.com/store/apps/details?id=com.DevAsh.RMart <br><br>
        
    //     Regards,<br>
    //     rMart Team</p>`,
    //     to:'students@rajalakshmi.edu.in'
    //   })
    // }


    // axios.post('http://email:8000/sendNotification',{
    //   title:"Open Now!",
    //   subtitle:"The sale for tomorrow's meal is open now!",
    //   topic:'rMart'
    // })
     console.log("sended email")
  }catch(e){
    console.log(e)
  }
},
{ 
scheduled: true,
timezone: "Asia/Kolkata"
}
);


var task3 = cron.schedule('00 18 * * *', () => {
  try{

    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330; 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    var day = ISTTime.getDay()

    // if(day!=6){
    //   axios.post('http://email:8000/sendNotification',{
    //     title:"You there!",
    //     subtitle:"Haven't ordered foods for tommorow yet? Grab your phone right away and order now!",
    //     topic:'rMart'
    //   })
    // }
     console.log("sended email")
  }catch(e){
    console.log(e)
  }
},
{ 
scheduled: true,
timezone: "Asia/Kolkata"
}
);

var task4 = cron.schedule('50 22 * * *', () => {
  try{

    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330; 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
    var day = ISTTime.getDay()

    // if(day!=6){
    //     axios.post('http://email:8000/sendNotification',{
    //       title:"Hurry up!",
    //       subtitle:"The order requests are closing soon in few minutes! Grab your phone and order now!",
    //       topic:'rMart'
    //     })
    // }
     console.log("sended email")
  }catch(e){
    console.log(e)
  }
},
{ 
scheduled: true,
timezone: "Asia/Kolkata"
}
);
module.exports = {task1,task2,task3,task4};