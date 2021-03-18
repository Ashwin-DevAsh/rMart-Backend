var cron = require('node-cron');
var axios = require('axios');
var dailyReport = new (require('../Services/DailyReport'))();

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


var task3 = cron.schedule('26 18 * * *', async() => {
  console.log('task 3 executing...')
  try{

    var todayOrders = await dailyReport.getTodayOrders()

    var totalOrders = 0;
    var pendingOredrs = 0;
    var deliveredOrders = 0;
    var productString = ``
    var productMap = {}

    for(var i in todayOrders){
      var order = todayOrders[i]
      totalOrders+=1
      if(order.status == 'pending'){
          pendingOredrs+=1
          continue;
      }else{
          deliveredOrders+=1
      }

      for(var i in order){
        var productID = order[i].productID
        try{
          productMap[productID].productName =  order[i].product.productName;
          productMap[productID].count += order[i].count
          productMap[productID].totalPrice += order[i].totalPrice
        }catch(e){
          productMap[productID] = {
            productName : product.productName,
            count : count,
            totalPrice:totalPrice
          }
        }
      }
    }

    for( var i in productMap){
      var product = productMap[i]

      productString += `<tr> 
        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${product.productName}</td>
        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${product.count}</td>
        <td style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >${product.totalPrice} Rs</td>
      </tr>` 
    }


    axios.post('http://email:8000/sendMail',{
      subject:"New Order",
      body:`<p>
              Total Orders         ${totalOrders} <br/>
              Pending Orders       ${pendingOredrs} <br/>
              Delivered Orders     ${deliveredOrders} <br/><br/><br/>
              <table style="width:100%;" >
                <tr>
                  <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Product</th>
                  <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;">Count</th>
                  <th style=" border: 1px solid #dddddd; padding: 8px;text-align: left;" >Amount</th>
                </tr>
                ${productString}
              </table>
           </p>`,
     to:'2017ashwin@gmail.com',
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





module.exports = {task1,task2,task3};