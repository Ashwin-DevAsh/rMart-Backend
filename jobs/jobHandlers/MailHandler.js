var cron = require('node-cron');
var axios = require('axios');

var task1 = cron.schedule('00 20 * * *', () => {
    try{

      var currentTime = new Date();
      var currentOffset = currentTime.getTimezoneOffset();
      var ISTOffset = 330; 
      var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
      var day = ISTTime.getDay()

      if(day!=6)
      axios.post('http://email:8000/sendMail',{
         subject:"Hurry up! The sale for tomorrow's meal closing in an hour!",
         body:`<p>Hey!<br><br>
               The order requests for tomorrow's meal is closing in an hour! Don't miss tomorrow's special recipes from the restaurants at our campus! Grab your phone and order now from our rMart app right away!<br><br>

               The sale will be open till 9:00 PM. Hurry up!<br>
                
               Feel free to drop your suggestions/queries /bug reports at rmart.support@rajalakshmi.edu.in<br><br>
                
               Regards,<br>
               rMart Team</p>`,
        to:'recfaculty@rajalakshmi.edu.in'
       })
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

    if(day!=6)
    axios.post('http://email:8000/sendMail',{
       subject:"Open now! Sale for tomorrow's meal is live now!",
       body:`<p>Hey!<br><br>
       The sale for tomorrow's meal is open now! Order safe and hygiene meals  from restaurants at our campus.<br><br>
       
       The sale will be open till 9:00 PM tonight.<br><br>
       
       Feel free to drop your suggestion/queries /bug report @ rmart.support@rajalakshmi.edu.in<br><br>
       
       Regards,<br>
       rMart Team</p>`,
      to:'recfaculty@rajalakshmi.edu.in'
     })
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
module.exports = {task1,task2};