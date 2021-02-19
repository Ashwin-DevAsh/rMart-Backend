var cron = require('node-cron');
var axios = require('axios');

var task = cron.schedule('0/1 * * * *', () => {
    try{
       axios('http://email:8000/sendEmail',{
         subject:"Hurry up! The sale for tomorrow's meal closing in an hour!",
         body:`<p>Hey!
               The order requests for tomorrow's meal is closing in an hour! Don't miss tomorrow's special recipes from the restaurants at our campus! Grab your phone and order now from our rMart app right away!</br>

               The sale will be open till 9:00 PM. Hurry up!</br>
                
               Feel free to drop your suggestions/queries /bug reports at rmart.support@rajalakshmi.edu.in</br>
                
               Regards,</br>
               rMart Team</p>`,
        to:'2017ashwin@gmail.com'
       })
    }catch(e){
      console.log(e)
    }
},
// { 
//   scheduled: true,
//   timezone: "Asia/Kolkata"}
  );
module.exports = task;