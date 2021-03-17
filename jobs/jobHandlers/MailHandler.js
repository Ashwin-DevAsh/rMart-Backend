var cron = require('node-cron');
var axios = require('axios');

var task1 = cron.schedule('00 07 * * *', () => {
    try{

      var currentTime = new Date();
      var currentOffset = currentTime.getTimezoneOffset();
      var ISTOffset = 330; 
      var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
      var day = ISTTime.getDay()

      if(day!=0){
          axios.post('http://email:8000/sendNotification',{
            title:"Feeling Hungry!",
            subtitle:"Order Delicious snacks from rMart app at discounted rates! What are you waiting for?  Order right away !",
            topic:'rMart'
          })
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



    if(day!=0){
      axios.post('http://email:8000/sendNotification',{
        title:"No pre-ordering required!!!",
        subtitle:"What are you waiting for? Order delicious snacks at discounted rate and grab your snacks right away!",
        topic:'rMart'
      })
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




module.exports = {task1,task2,task3,task4};